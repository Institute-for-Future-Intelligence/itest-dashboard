import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { waterQualityService } from '../firebase/waterQualityService';
import type { 
  WaterQualityDataPoint, 
  WaterQualityFilters, 
  WaterQualityFormData,
  WaterQualityValidationResult 
} from '../types/waterQuality';

// Table state interface
interface TableState {
  page: number;
  rowsPerPage: number;
  expandedRows: Set<string>;
  sortField?: keyof WaterQualityDataPoint;
  sortDirection?: 'asc' | 'desc';
}

// Filter UI state interface
interface FilterUIState {
  isExpanded: boolean;
  localFilters: WaterQualityFilters;
}

// Form state interface
interface FormState {
  formData: WaterQualityFormData;
  isSubmitting: boolean;
  validation: WaterQualityValidationResult | null;
  submitSuccess: boolean;
  submitError: string | null;
}

interface WaterQualityStore {
  // Data state
  data: WaterQualityDataPoint[];
  loading: boolean;
  error: string | null;
  filters: WaterQualityFilters;
  
  // Table state
  table: TableState;
  
  // Filter UI state
  filterUI: FilterUIState;
  
  // Form state
  form: FormState;
  
  // Data actions
  loadData: (filters?: WaterQualityFilters) => Promise<void>;
  setFilters: (filters: WaterQualityFilters) => void;
  clearFilters: () => void;
  
  // Table actions
  setPage: (page: number) => void;
  setRowsPerPage: (rowsPerPage: number) => void;
  toggleRowExpansion: (rowId: string) => void;
  setSort: (field: keyof WaterQualityDataPoint, direction: 'asc' | 'desc') => void;
  
  // Filter UI actions
  setFilterExpanded: (expanded: boolean) => void;
  setLocalFilters: (filters: WaterQualityFilters) => void;
  applyLocalFilters: () => void;
  
  // Form actions
  setFormData: (formData: Partial<WaterQualityFormData>) => void;
  resetForm: () => void;
  validateForm: () => void;
  submitForm: (userId: string) => Promise<void>;
  clearFormMessages: () => void;
  
  // Computed getters
  getFilteredData: () => WaterQualityDataPoint[];
  getPaginatedData: () => WaterQualityDataPoint[];
  getActiveFiltersCount: () => number;
}

// Default form data
const getDefaultFormData = (): WaterQualityFormData => ({
  date: new Date().toISOString().split('T')[0], // Today's date
  time: new Date().toTimeString().slice(0, 5), // Current time
  location: 'waikalua_loko_ia', // Default location
  temperature: '',
  ph: '',
  salinity: '',
  conductivity: '',
  nitrate: '',
  nitrite: '',
  ammonia: '',
  phosphate: '',
  potassium: '',
  notes: '',
});

export const useWaterQualityStore = create<WaterQualityStore>()(
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
      
      // Initial form state
      form: {
        formData: getDefaultFormData(),
        isSubmitting: false,
        validation: null,
        submitSuccess: false,
        submitError: null,
      },
      
      // Data actions
      loadData: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
          const data = await waterQualityService.getWaterQualityData(filters);
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
        set({ filters: localFilters });
        get().loadData(localFilters);
      },
      
      // Form actions
      setFormData: (newFormData) => {
        set(state => ({
          form: {
            ...state.form,
            formData: { ...state.form.formData, ...newFormData },
            validation: null, // Clear validation when form changes
            submitSuccess: false, // Clear success when form changes
            submitError: null, // Clear error when form changes
          }
        }));
      },
      
      resetForm: () => {
        set(state => ({
          form: {
            ...state.form,
            formData: getDefaultFormData(),
            validation: null,
            submitSuccess: false,
            submitError: null,
          }
        }));
      },
      
      validateForm: () => {
        const { formData } = get().form;
        const validation = waterQualityService.validateFormData(formData);
        set(state => ({
          form: { ...state.form, validation }
        }));
      },
      
      submitForm: async (userId: string) => {
        const { formData } = get().form;
        
        // Validate first
        const validation = waterQualityService.validateFormData(formData);
        if (!validation.isValid) {
          set(state => ({
            form: { 
              ...state.form, 
              validation,
              submitError: 'Please fix the errors before submitting'
            }
          }));
          return;
        }
        
        // Submit
        set(state => ({
          form: { ...state.form, isSubmitting: true, submitError: null }
        }));
        
        try {
          await waterQualityService.addWaterQualityEntry(formData, userId);
          
          // Success
          set(state => ({
            form: {
              ...state.form,
              isSubmitting: false,
              submitSuccess: true,
              validation: null,
              formData: getDefaultFormData(), // Reset form
            }
          }));
          
          // Refresh data
          get().loadData(get().filters);
          
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to submit data';
          set(state => ({
            form: {
              ...state.form,
              isSubmitting: false,
              submitError: errorMessage,
            }
          }));
        }
      },
      
      clearFormMessages: () => {
        set(state => ({
          form: {
            ...state.form,
            submitSuccess: false,
            submitError: null,
            validation: null,
          }
        }));
      },
      
      // Computed getters
      getFilteredData: () => {
        const { data, table } = get();
        
        if (!table.sortField) return data;
        
        return [...data].sort((a, b) => {
          const aVal = a[table.sortField!];
          const bVal = b[table.sortField!];
          
          // Handle undefined values
          if (aVal === undefined && bVal === undefined) return 0;
          if (aVal === undefined) return 1;
          if (bVal === undefined) return -1;
          
          let comparison = 0;
          if (aVal < bVal) comparison = -1;
          if (aVal > bVal) comparison = 1;
          
          return table.sortDirection === 'desc' ? -comparison : comparison;
        });
      },
      
      getPaginatedData: () => {
        const { table } = get();
        const filteredData = get().getFilteredData();
        const startIndex = table.page * table.rowsPerPage;
        const endIndex = startIndex + table.rowsPerPage;
        
        return filteredData.slice(startIndex, endIndex);
      },
      
      getActiveFiltersCount: () => {
        const { filters } = get();
        let count = 0;
        
        if (filters.dateRange) count++;
        if (filters.location) count++;
        if (filters.temperatureRange) count++;
        if (filters.phRange) count++;
        if (filters.salinityRange) count++;
        if (filters.conductivityRange) count++;
        if (filters.nitrateRange) count++;
        if (filters.nitriteRange) count++;
        if (filters.ammoniaRange) count++;
        if (filters.phosphateRange) count++;
        if (filters.enteredBy) count++;
        
        return count;
      },
    }),
    {
      name: 'water-quality-store',
    }
  )
); 