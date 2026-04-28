import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { observationService } from '../firebase/observationService';
import type {
  SeaweedObservation,
  ObservationFilters,
  ObservationFormData,
  ObservationValidationResult,
} from '../types/observation';

interface TableState {
  page: number;
  rowsPerPage: number;
  expandedRows: Set<string>;
  sortField?: keyof SeaweedObservation;
  sortDirection?: 'asc' | 'desc';
}

interface FilterUIState {
  isExpanded: boolean;
  localFilters: ObservationFilters;
}

interface FormState {
  formData: ObservationFormData;
  isSubmitting: boolean;
  validation: ObservationValidationResult | null;
  submitSuccess: boolean;
  submitError: string | null;
}

interface ObservationStore {
  data: SeaweedObservation[];
  loading: boolean;
  error: string | null;
  filters: ObservationFilters;

  table: TableState;
  filterUI: FilterUIState;
  form: FormState;

  loadData: (filters?: ObservationFilters) => Promise<void>;
  setFilters: (filters: ObservationFilters) => void;
  clearFilters: () => void;

  setPage: (page: number) => void;
  setRowsPerPage: (rowsPerPage: number) => void;
  toggleRowExpansion: (rowId: string) => void;
  setSort: (field: keyof SeaweedObservation, direction: 'asc' | 'desc') => void;

  setFilterExpanded: (expanded: boolean) => void;
  setLocalFilters: (filters: ObservationFilters) => void;
  applyLocalFilters: () => void;

  setFormData: (formData: Partial<ObservationFormData>) => void;
  resetForm: () => void;
  validateForm: () => void;
  submitForm: (userId: string) => Promise<void>;
  clearFormMessages: () => void;

  getFilteredData: () => SeaweedObservation[];
  getPaginatedData: () => SeaweedObservation[];
  getActiveFiltersCount: () => number;
}

const getDefaultFormData = (): ObservationFormData => ({
  date: new Date().toISOString().split('T')[0],
  time: new Date().toTimeString().slice(0, 5),
  species: 'ogo_manuea',
  location: 'fh_107_growth_chamber',
  observer: '',

  wetMassGrams: '',

  salinity: '',
  temperature: '',
  temperatureUnit: 'F',
  ph: '',
  dissolvedOxygen: '',

  containerVolume: '',
  containerVolumeUnit: 'gallons',

  lightScheduleStart: '',
  lightScheduleEnd: '',
  lightWhitePercent: '',
  lightRedPercent: '',
  lightBluePercent: '',

  waterExchangePercent: '',
  waterExchangeSource: '',
  nutrientsAdded: '',

  colorDescription: '',
  healthNotes: '',
  generalNotes: '',

  sensorIssuesNoted: false,
  dataReliability: 'reliable',
});

export const useObservationStore = create<ObservationStore>()(
  devtools(
    (set, get) => ({
      data: [],
      loading: false,
      error: null,
      filters: {},

      table: {
        page: 0,
        rowsPerPage: 25,
        expandedRows: new Set(),
        sortField: undefined,
        sortDirection: undefined,
      },

      filterUI: {
        isExpanded: false,
        localFilters: {},
      },

      form: {
        formData: getDefaultFormData(),
        isSubmitting: false,
        validation: null,
        submitSuccess: false,
        submitError: null,
      },

      loadData: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
          const data = await observationService.getObservations(filters);
          set({ data, loading: false });
        } catch (error) {
          const msg = error instanceof Error ? error.message : 'Failed to load observations';
          set({ error: msg, loading: false });
        }
      },

      setFilters: (filters) => {
        set({ filters });
        get().loadData(filters);
      },

      clearFilters: () => {
        const empty: ObservationFilters = {};
        set({ filters: empty, filterUI: { ...get().filterUI, localFilters: empty } });
        get().loadData(empty);
      },

      setPage: (page) => set(s => ({ table: { ...s.table, page } })),

      setRowsPerPage: (rowsPerPage) =>
        set(s => ({ table: { ...s.table, rowsPerPage, page: 0 } })),

      toggleRowExpansion: (rowId) =>
        set(s => {
          const next = new Set(s.table.expandedRows);
          if (next.has(rowId)) {
            next.delete(rowId);
          } else {
            next.add(rowId);
          }
          return { table: { ...s.table, expandedRows: next } };
        }),

      setSort: (field, direction) =>
        set(s => ({ table: { ...s.table, sortField: field, sortDirection: direction } })),

      setFilterExpanded: (expanded) =>
        set(s => ({ filterUI: { ...s.filterUI, isExpanded: expanded } })),

      setLocalFilters: (localFilters) =>
        set(s => ({ filterUI: { ...s.filterUI, localFilters } })),

      applyLocalFilters: () => {
        const { localFilters } = get().filterUI;
        set({ filters: localFilters });
        get().loadData(localFilters);
      },

      setFormData: (newData) =>
        set(s => ({
          form: {
            ...s.form,
            formData: { ...s.form.formData, ...newData },
            validation: null,
            submitSuccess: false,
            submitError: null,
          },
        })),

      resetForm: () =>
        set(s => ({
          form: {
            ...s.form,
            formData: getDefaultFormData(),
            validation: null,
            submitSuccess: false,
            submitError: null,
          },
        })),

      validateForm: () => {
        const validation = observationService.validateFormData(get().form.formData);
        set(s => ({ form: { ...s.form, validation } }));
      },

      submitForm: async (userId: string) => {
        const { formData } = get().form;
        const validation = observationService.validateFormData(formData);
        if (!validation.isValid) {
          set(s => ({ form: { ...s.form, validation, submitError: 'Please fix errors before submitting' } }));
          return;
        }

        set(s => ({ form: { ...s.form, isSubmitting: true, submitError: null } }));
        try {
          await observationService.addObservation(formData, userId);
          set(s => ({
            form: {
              ...s.form,
              isSubmitting: false,
              submitSuccess: true,
              validation: null,
              formData: getDefaultFormData(),
            },
          }));
          get().loadData(get().filters);
        } catch (error) {
          const msg = error instanceof Error ? error.message : 'Failed to submit observation';
          set(s => ({ form: { ...s.form, isSubmitting: false, submitError: msg } }));
        }
      },

      clearFormMessages: () =>
        set(s => ({
          form: { ...s.form, submitSuccess: false, submitError: null, validation: null },
        })),

      getFilteredData: () => {
        const { data, table } = get();
        if (!table.sortField) return data;
        return [...data].sort((a, b) => {
          const av = a[table.sortField!];
          const bv = b[table.sortField!];
          if (av === undefined && bv === undefined) return 0;
          if (av === undefined) return 1;
          if (bv === undefined) return -1;
          const cmp = av < bv ? -1 : av > bv ? 1 : 0;
          return table.sortDirection === 'desc' ? -cmp : cmp;
        });
      },

      getPaginatedData: () => {
        const { table } = get();
        const filtered = get().getFilteredData();
        return filtered.slice(table.page * table.rowsPerPage, (table.page + 1) * table.rowsPerPage);
      },

      getActiveFiltersCount: () => {
        const { filters } = get();
        return [filters.dateRange, filters.species, filters.location, filters.enteredBy, filters.dataReliability]
          .filter(Boolean).length;
      },
    }),
    { name: 'observation-store' }
  )
);
