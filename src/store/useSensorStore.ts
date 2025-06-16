import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { sensorService } from '../firebase/sensorService';
import type { SensorDataPoint, SensorDataFilters, ExcelValidationResult } from '../types/sensor';
import type { DuplicateDetectionResult } from '../firebase/sensorService';

// Table state interface
interface TableState {
  page: number;
  rowsPerPage: number;
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
  
  // Table state
  table: TableState;
  
  // Filter UI state
  filterUI: FilterUIState;
  
  // Upload state
  upload: UploadState;
  
  // Data actions
  loadData: (filters?: SensorDataFilters) => Promise<void>;
  setFilters: (filters: SensorDataFilters) => void;
  clearFilters: () => void;
  
  // Table actions
  setPage: (page: number) => void;
  setRowsPerPage: (rowsPerPage: number) => void;
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
  getPaginatedData: () => SensorDataPoint[];
  getActiveFiltersCount: () => number;
}

export const useSensorStore = create<SensorStore>()(
  devtools(
    (set, get) => ({
      // Initial data state
      data: [],
      loading: false,
      error: null,
      filters: {},
      
      // Initial table state
      table: {
        page: 0,
        rowsPerPage: 25,
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
      
      // Data actions
      loadData: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
          const data = await sensorService.getSensorData(filters);
          set({ data, loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to load data';
          set({ error: errorMessage, loading: false });
        }
      },
      
      setFilters: (filters) => {
        set({ filters });
        get().loadData(filters);
      },
      
      clearFilters: () => {
        const emptyFilters = {};
        set({ 
          filters: emptyFilters,
          filterUI: { ...get().filterUI, localFilters: emptyFilters }
        });
        get().loadData(emptyFilters);
      },
      
      // Table actions
      setPage: (page) => {
        set(state => ({
          table: { ...state.table, page }
        }));
      },
      
      setRowsPerPage: (rowsPerPage) => {
        set(state => ({
          table: { ...state.table, rowsPerPage, page: 0 }
        }));
      },
      
      toggleRowExpansion: (rowId) => {
        set(state => {
          const newExpanded = new Set(state.table.expandedRows);
          if (newExpanded.has(rowId)) {
            newExpanded.delete(rowId);
          } else {
            newExpanded.add(rowId);
          }
          return {
            table: { ...state.table, expandedRows: newExpanded }
          };
        });
      },
      
      setSort: (field, direction) => {
        set(state => ({
          table: { ...state.table, sortField: field, sortDirection: direction }
        }));
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
        const { localFilters } = get().filterUI;
        get().setFilters(localFilters);
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
        // Return filtered data based on current filters
        // This could include client-side filtering if needed
        return data;
      },
      
      getPaginatedData: () => {
        const { table } = get();
        const data = get().getFilteredData();
        const startIndex = table.page * table.rowsPerPage;
        return data.slice(startIndex, startIndex + table.rowsPerPage);
      },
      
      getActiveFiltersCount: () => {
        const { localFilters } = get().filterUI;
        let count = 0;
        if (localFilters.dateRange) count++;
        if (localFilters.location) count++;
        if (localFilters.humidityRange) count++;
        if (localFilters.co2Range) count++;
        if (localFilters.phRange) count++;
        if (localFilters.salinityRange) count++;
        if (localFilters.uploadedBy) count++;
        return count;
      },
    }),
    {
      name: 'sensor-store',
    }
  )
); 