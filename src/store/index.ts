import { configureStore } from '@reduxjs/toolkit';
import { reportReducer, Reportable } from './slices/reportSlice';
import { tracerReducer, TracerState } from './slices/tracerSlice';

const store = configureStore({
  reducer: {
    tracer: tracerReducer,
    report: reportReducer,
  },
});

export { store };
export * from './slices/tracerSlice';
export * from './slices/reportSlice';

export interface StoreState {
  tracer: TracerState;
  report: Reportable;
}
