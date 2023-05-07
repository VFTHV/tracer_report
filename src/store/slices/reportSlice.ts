import { createSlice } from '@reduxjs/toolkit';
import { AllPassData } from '../../logics/TracerProcessor';
import { HeaderInfo } from '../../logics/HeaderProcessor';
import { setAllPassData, setHeader } from './tracerSlice';

export interface Reportable {
  reportablePasses: AllPassData[];
  reportableHeader: HeaderInfo;
  logo?: string;
}

const initialState: Reportable = {
  reportablePasses: [],
  reportableHeader: {
    date: '',
    company: '',
    well: '',
    field: '',
    state: '',
    district: '',
    county: '',
  },
  logo: '',
};

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    modifyReportablePass(
      state,
      action: { payload: { index: number; modifiedPass: AllPassData } }
    ) {
      const { index, modifiedPass } = action.payload;
      const newAllPassData = [...state.reportablePasses];
      newAllPassData[index] = modifiedPass;
      state.reportablePasses = newAllPassData;
    },
    setLogo(state, action) {
      state.logo = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(
      setAllPassData,
      (state, action: { payload: AllPassData[] }) => {
        state.reportablePasses = action.payload;
      }
    );
    builder.addCase(setHeader, (state, action: { payload: HeaderInfo }) => {
      state.reportableHeader = action.payload;
    });
  },
});

export const { modifyReportablePass, setLogo } = reportSlice.actions;
export const reportReducer = reportSlice.reducer;
