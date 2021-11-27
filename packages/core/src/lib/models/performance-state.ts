export interface PerformanceStoreState {
  current: number;
  min: number;
  max: number;
  debounce: number;
  regress: () => void;
}

export type NgtPerformance = Partial<Omit<PerformanceStoreState, 'regress'>>;
