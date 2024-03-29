import { createSlice } from '@reduxjs/toolkit';
import { Standards } from '../../logics/Standards';
import { AllPassData } from '../../logics/TracerProcessor';
import { HeaderInfo } from '../../logics/HeaderProcessor';

export interface TracerState {
  fileName: string;
  standard: string;
  totalDepth: number;
  file: File | null;
  allPassData: AllPassData[];
  reportablePassData: AllPassData[];
  header: HeaderInfo;
}

const initialState: TracerState = {
  fileName: '',
  standard: Standards.Texas,
  totalDepth: 0,
  file: null,
  allPassData: [],
  reportablePassData: [],
  header: {
    date: '',
    company: '',
    well: '',
    field: '',
    state: '',
    district: '',
    county: '',
    parish: '',
  },
};

const tracerSlice = createSlice({
  name: 'tracer',
  initialState,
  reducers: {
    changeFileName(state, action) {
      state.fileName = action.payload;
    },
    changeStandard(state, action) {
      state.standard = action.payload;
    },
    changeTotalDepth(state, action) {
      state.totalDepth = action.payload;
    },
    setAllPassData(state, action) {
      state.allPassData = action.payload;
    },
    setHeader(state, action: { payload: HeaderInfo }) {
      state.header = { ...state.header, ...action.payload };
    },
  },
});

export const {
  changeFileName,
  changeStandard,
  changeTotalDepth,
  setAllPassData,
  setHeader,
} = tracerSlice.actions;
export const tracerReducer = tracerSlice.reducer;
