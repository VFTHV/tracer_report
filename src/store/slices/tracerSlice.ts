import { createSlice } from '@reduxjs/toolkit';
import { Standards } from '../../logics/Standards';

export interface TracerState {
  fileName: string;
  standard: string;
  totalDepth: number;
  file: File | null;
}

const initialState: TracerState = {
  fileName: '',
  standard: Standards.Texas,
  totalDepth: 0,
  file: null,
};

const tracerSlice = createSlice({
  name: 'tracer',
  initialState,
  reducers: {
    changeFileName(state, action: { payload: string }) {
      state.fileName = action.payload;
    },
    changeStandard(state, action) {
      state.standard = action.payload;
    },
    changeTotalDepth(state, action: { payload: number }) {
      state.totalDepth = action.payload;
    },
  },
});

export const { changeFileName, changeStandard, changeTotalDepth } =
  tracerSlice.actions;
export const tracerReducer = tracerSlice.reducer;
