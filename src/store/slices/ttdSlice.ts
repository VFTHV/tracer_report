import { createSlice } from '@reduxjs/toolkit';

export interface TTDState {
  depthConvertedData: number[][];
  convertedColHeader: string[];
  depthConvertedHeader: string;
  fileName: string;
}

const initialState: TTDState = {
  depthConvertedData: [],
  convertedColHeader: [],
  depthConvertedHeader: '',
  fileName: '',
};

const ttdSlice = createSlice({
  name: 'ttd',
  initialState,
  reducers: {
    changeTtdFileName(state, action: { payload: string }) {
      state.fileName = action.payload;
    },
    setData(
      state,
      action: {
        payload: { data: number[][]; colHeader: string[]; header: string };
      }
    ) {
      const { data, colHeader, header } = action.payload;
      state.depthConvertedData = data;
      state.convertedColHeader = colHeader;
      state.depthConvertedHeader = header;
    },
  },
});

export const { changeTtdFileName, setData } = ttdSlice.actions;
export const ttdReducer = ttdSlice.reducer;
