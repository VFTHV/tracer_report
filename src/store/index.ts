import { configureStore } from '@reduxjs/toolkit';
import { reportReducer, Reportable } from './slices/reportSlice';
import { tracerReducer, TracerState } from './slices/tracerSlice';
import { ttdReducer, TTDState } from './slices/ttdSlice';

const store = configureStore<StoreState>({
  reducer: {
    tracer: tracerReducer,
    report: reportReducer,
    ttd: ttdReducer,
  },
});

export { store };
export * from './slices/tracerSlice';
export * from './slices/reportSlice';
export * from './slices/ttdSlice';

export interface StoreState {
  tracer: TracerState;
  report: Reportable;
  ttd: TTDState;
}
