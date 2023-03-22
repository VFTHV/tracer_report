import { configureStore } from '@reduxjs/toolkit';
import {
  tracerReducer,
  changeStandard,
  changeFileName,
  changeTotalDepth,
  TracerState,
} from './slices/tracerSlice';

const store = configureStore({
  reducer: {
    tracer: tracerReducer,
  },
});

export { store, changeStandard, changeFileName, changeTotalDepth };

export interface Store {
  tracer: TracerState;
}
