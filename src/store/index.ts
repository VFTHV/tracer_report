import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { reportReducer, Reportable } from './slices/reportSlice';
import { tracerReducer, TracerState } from './slices/tracerSlice';
import { ttdReducer, TTDState } from './slices/ttdSlice';
import { spikeReducer, SpikeState } from './slices/spikeSlice';

const store = configureStore({
  reducer: {
    tracer: tracerReducer,
    report: reportReducer,
    ttd: ttdReducer,
    spike: spikeReducer,
  },
  middleware: [],
});

export { store };
export * from './slices/tracerSlice';
export * from './slices/reportSlice';
export * from './slices/ttdSlice';
export * from './slices/spikeSlice';

export interface StoreState {
  tracer: TracerState;
  report: Reportable;
  ttd: TTDState;
  spike: SpikeState;
}
