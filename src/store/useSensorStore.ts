import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { DocumentSnapshot } from 'firebase/firestore';
import { sensorService } from '../firebase/sensorService';
import type { SensorDataPoint, SensorDataFilters, ExcelValidationResult } from '../types/sensor';
import type { DuplicateDetectionResult } from '../firebase/sensorService';

// Performance optimization constants
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache
const DEBOUNCE_DELAY = 300; // 300ms debounce for filter changes
const DEFAULT_PAGE_SIZE = 50; // Default page size for cursor pagination

// Cache interface
interface DataCache {
  data: SensorDataPoint[];
  timestamp: number;
  filters: SensorDataFilters;
  filtersHash: string;
}

// Cursor pagination interface
interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
  isLoading: boolean;
  cursors: { [page: number]: DocumentSnapshot }; // Store cursors for each page
  pageData: { [page: number]: SensorDataPoint[] }; // Cache page data
}

// Table state interface
interface TableState {
  expandedRows: Set<string>;
  sortField?: keyof SensorDataPoint;
  sortDirection?: 'asc' | 'desc';
}

// Filter UI state interface
interface FilterUIState {
  isExpanded: boolean;
  localFilters: SensorDataFilters;
}

// Upload state interface
interface UploadState {
  isUploading: boolean;
  uploadProgress: number;
  selectedFile: File | null;
  validation: ExcelValidationResult | null;
  uploadStatus: 'idle' | 'validating' | 'checking-duplicates' | 'uploading' | 'success' | 'error';
  errorMessage: string;
  isDragOver: boolean;
  selectedLocation: string;
  duplicateInfo: DuplicateDetectionResult | null;
  showDuplicateDialog: boolean;
  uploadResult: {
    processedCount: number;
    skippedCount?: number;
    overwrittenCount?: number;
  } | null;
}

interface SensorStore {
  // Data state
  data: SensorDataPoint[];
  loading: boolean;
  error: string | null;
  filters: SensorDataFilters;
  
  // Cache state
  cache: DataCache | null;
  
  // Pagination state
  pagination: PaginationState;
  
  // Table state
  table: TableState;
  
  // Filter UI state
  filterUI: FilterUIState;
  
  // Upload state
  upload: UploadState;
  
  // Data actions
  loadData: (filters?: SensorDataFilters, forceRefresh?: boolean) => Promise<void>;
  loadDataDebounced: (filters?: SensorDataFilters) => void;
  loadPage: (page: number) => Promise<void>;
  setFilters: (filters: SensorDataFilters) => void;
  clearFilters: () => void;
  clearCache: () => void;
  
  // Pagination actions
  setPageSize: (pageSize: number) => void;
  goToPage: (page: number) => void;
  resetPagination: () => void;
  
  // Table actions
  toggleRowExpansion: (rowId: string) => void;
  setSort: (field: keyof SensorDataPoint, direction: 'asc' | 'desc') => void;
  
  // Filter UI actions
  setFilterExpanded: (expanded: boolean) => void;
  setLocalFilters: (filters: SensorDataFilters) => void;
  applyLocalFilters: () => void;
  
  // Upload actions
  setSelectedFile: (file: File | null) => void;
  setValidation: (validation: ExcelValidationResult | null) => void;
  setUploadStatus: (status: UploadState['uploadStatus']) => void;
  setUploadProgress: (progress: number) => void;
  setErrorMessage: (message: string) => void;
  setDragOver: (isDragOver: boolean) => void;
  setSelectedLocation: (location: string) => void;
  setDuplicateInfo: (duplicateInfo: DuplicateDetectionResult | null) => void;
  setShowDuplicateDialog: (show: boolean) => void;
  setUploadResult: (result: UploadState['uploadResult']) => void;
  resetUploadState: () => void;
  
  // Computed getters
  getFilteredData: () => SensorDataPoint[];
  getCurrentPageData: () => SensorDataPoint[];
  getActiveFiltersCount: () => number;
  getTotalRecordsEstimate: () => number;
}

// Helper function to create a hash from filters for cache comparison
const createFiltersHash = (filters: SensorDataFilters): string => {
  return JSON.stringify(filters, Object.keys(filters).sort());
};

// Debounce utility
let debounceTimer: NodeJS.Timeout | null = null;

export const useSensorStore = create<SensorStore>()(
  devtools(
    (set, get) => ({
      // Initial data state
      data: [],
      loading: false,
      error: null,
      filters: {},
      
      // Initial cache state
      cache: null,
      
      // Initial pagination state
      pagination: {
        currentPage: 0,
        pageSize: DEFAULT_PAGE_SIZE,
        totalPages: 0,
        hasMore: false,
        isLoading: false,
        cursors: {},
        pageData: {},
      },
      
      // Initial table state
      table: {
        expandedRows: new Set(),
        sortField: undefined,
        sortDirection: undefined,
      },
      
      // Initial filter UI state
      filterUI: {
        isExpanded: false,
        localFilters: {},
      },
      
      // Initial upload state
      upload: {
        isUploading: false,
        uploadProgress: 0,
        selectedFile: null,
        validation: null,
        uploadStatus: 'idle',
        errorMessage: '',
        isDragOver: false,
        selectedLocation: 'waikalua_loko_ia', // Default location
        duplicateInfo: null,
        showDuplicateDialog: false,
        uploadResult: null,
      },
      
      // Data actions with cursor pagination
      loadData: async (filters = {}, forceRefresh = false) => {
        const { cache, pagination } = get();
        const filtersHash = createFiltersHash(filters);
        
        // Reset pagination when filters change
        if (filtersHash !== createFiltersHash(get().filters)) {
          get().resetPagination();
        }
        
        // Check cache first (unless forced refresh)
        if (!forceRefresh && cache && cache.filtersHash === filtersHash) {
          const cacheAge = Date.now() - cache.timestamp;
          if (cacheAge < CACHE_TTL) {
            // Use cached data and set up pagination
            set({ 
              data: cache.data, 
              loading: false, 
              error: null,
              pagination: {
                ...pagination,
                pageData: { 0: cache.data.slice(0, pagination.pageSize) },
                hasMore: cache.data.length > pagination.pageSize,
                totalPages: Math.ceil(cache.data.length / pagination.pageSize),
                currentPage: 0,
              }
            });
            return;
          }
        }
        
        // Load first page with cursor pagination
        await get().loadPage(0);
      },
      
      // Load specific page using cursor pagination
      loadPage: async (page: number) => {
        const { pagination, filters } = get();
        
        // Check if page is already loaded
        if (pagination.pageData[page]) {
          set(state => ({
            data: state.pagination.pageData[page],
            pagination: {
              ...state.pagination,
              currentPage: page,
            }
          }));
          return;
        }
        
        set(state => ({
          pagination: {
            ...state.pagination,
            isLoading: true,
          }
        }));
        
        try {
          const cursor = page > 0 ? pagination.cursors[page - 1] : undefined;
          const result = await sensorService.getSensorDataPaginated(
            filters,
            cursor,
            pagination.pageSize
          );
          
          // Update page data and cursors
          const newPageData = { ...pagination.pageData };
          newPageData[page] = result.data;
          
          const newCursors = { ...pagination.cursors };
          if (result.lastDoc) {
            newCursors[page] = result.lastDoc;
          }
          
          set(state => ({
            data: result.data,
            loading: false,
            error: null,
            pagination: {
              ...state.pagination,
              currentPage: page,
              hasMore: result.hasMore,
              isLoading: false,
              pageData: newPageData,
              cursors: newCursors,
              totalPages: result.hasMore ? page + 2 : page + 1, // Estimate
            }
          }));
          
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to load page';
          set(state => ({
            error: errorMessage,
            loading: false,
            pagination: {
              ...state.pagination,
              isLoading: false,
            }
          }));
        }
      },
      
      // Debounced version of loadData
      loadDataDebounced: (filters = {}) => {
        if (debounceTimer) {
          clearTimeout(debounceTimer);
        }
        
        debounceTimer = setTimeout(() => {
          get().loadData(filters);
        }, DEBOUNCE_DELAY);
      },
      
      setFilters: (filters) => {
        set({ filters });
        // Reset pagination when filters change
        get().resetPagination();
        // Use debounced loading for better performance
        get().loadDataDebounced(filters);
      },
      
      clearFilters: () => {
        const emptyFilters = {};
        set({ 
          filters: emptyFilters,
          filterUI: { ...get().filterUI, localFilters: emptyFilters }
        });
        get().resetPagination();
        get().loadData(emptyFilters);
      },
      
      clearCache: () => {
        set({ cache: null });
      },
      
      // Pagination actions
      setPageSize: (pageSize) => {
        set(state => ({
          pagination: {
            ...state.pagination,
            pageSize,
            currentPage: 0,
            pageData: {},
            cursors: {},
          }
        }));
        // Reload first page with new page size
        get().loadPage(0);
      },
      
      goToPage: (page) => {
        get().loadPage(page);
      },
      
      resetPagination: () => {
        set(state => ({
          pagination: {
            ...state.pagination,
            currentPage: 0,
            totalPages: 0,
            hasMore: false,
            cursors: {},
            pageData: {},
          }
        }));
      },
      
      // Table actions
      toggleRowExpansion: (rowId) => {
        set(state => {
          const newExpandedRows = new Set(state.table.expandedRows);
          if (newExpandedRows.has(rowId)) {
            newExpandedRows.delete(rowId);
          } else {
            newExpandedRows.add(rowId);
          }
          return {
            table: { ...state.table, expandedRows: newExpandedRows }
          };
        });
      },
      
      setSort: (field, direction) => {
        set(state => ({
          table: { ...state.table, sortField: field, sortDirection: direction }
        }));
        // Reset pagination and reload with new sort
        get().resetPagination();
        get().loadData(get().filters);
      },
      
      // Filter UI actions
      setFilterExpanded: (expanded) => {
        set(state => ({
          filterUI: { ...state.filterUI, isExpanded: expanded }
        }));
      },
      
      setLocalFilters: (localFilters) => {
        set(state => ({
          filterUI: { ...state.filterUI, localFilters }
        }));
      },
      
      applyLocalFilters: () => {
        const { filterUI } = get();
        get().setFilters(filterUI.localFilters);
      },
      
      // Upload actions
      setSelectedFile: (selectedFile) => {
        set(state => ({
          upload: { ...state.upload, selectedFile }
        }));
      },
      
      setValidation: (validation) => {
        set(state => ({
          upload: { ...state.upload, validation }
        }));
      },
      
      setUploadStatus: (uploadStatus) => {
        set(state => ({
          upload: { ...state.upload, uploadStatus }
        }));
      },
      
      setUploadProgress: (uploadProgress) => {
        set(state => ({
          upload: { ...state.upload, uploadProgress }
        }));
      },
      
      setErrorMessage: (errorMessage) => {
        set(state => ({
          upload: { ...state.upload, errorMessage }
        }));
      },
      
      setDragOver: (isDragOver) => {
        set(state => ({
          upload: { ...state.upload, isDragOver }
        }));
      },
      
      setSelectedLocation: (selectedLocation) => {
        set(state => ({
          upload: { ...state.upload, selectedLocation }
        }));
      },
      
      setDuplicateInfo: (duplicateInfo) => {
        set(state => ({
          upload: { ...state.upload, duplicateInfo }
        }));
      },
      
      setShowDuplicateDialog: (showDuplicateDialog) => {
        set(state => ({
          upload: { ...state.upload, showDuplicateDialog }
        }));
      },
      
      setUploadResult: (uploadResult) => {
        set(state => ({
          upload: { ...state.upload, uploadResult }
        }));
      },
      
      resetUploadState: () => {
        set(state => ({
          upload: {
            ...state.upload,
            selectedFile: null,
            validation: null,
            uploadStatus: 'idle',
            uploadProgress: 0,
            errorMessage: '',
            isDragOver: false,
            duplicateInfo: null,
            showDuplicateDialog: false,
            uploadResult: null,
          }
        }));
      },
      
      // Computed getters
      getFilteredData: () => {
        const { data } = get();
        return data;
      },
      
      getCurrentPageData: () => {
        const { data } = get();
        return data; // Data is already paginated from Firebase
      },
      
      getActiveFiltersCount: () => {
        const { filters } = get();
        return Object.keys(filters).filter(key => {
          const value = filters[key as keyof SensorDataFilters];
          return value !== undefined && value !== null && value !== '';
        }).length;
      },
      
      getTotalRecordsEstimate: () => {
        const { pagination } = get();
        // Estimate based on current page and hasMore
        if (pagination.hasMore) {
          return (pagination.currentPage + 1) * pagination.pageSize + 1; // At least one more
        }
        return pagination.currentPage * pagination.pageSize + (get().data.length || 0);
      },
    }),
    {
      name: 'sensor-store',
    }
  )
); 