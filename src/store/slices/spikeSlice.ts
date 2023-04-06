import { createSlice } from '@reduxjs/toolkit';
import { PlotData } from '../../logics/LogVisualization';

export interface SpikeState {
  curveToCorrect: string;
  depthCurve: string;
  plotData: PlotData[];
}

const initialState: SpikeState = {
  curveToCorrect: 'DET2',
  depthCurve: 'ADPTH',
  plotData: [],
};

const spikeSlice = createSlice({
  name: 'spike',
  initialState,
  reducers: {
    changeCurve(state, action: { payload: string }) {
      const curve = action.payload.trim().toUpperCase();
      state.curveToCorrect = curve;
    },
    changeDepthCurve(state, action: { payload: string }) {
      const curve = action.payload.trim().toUpperCase();
      state.depthCurve = curve;
    },
    setPlotData(state, action: { payload: PlotData[] }) {
      state.plotData = action.payload;
    },
  },
});

export const { changeCurve, changeDepthCurve, setPlotData } =
  spikeSlice.actions;
export const spikeReducer = spikeSlice.reducer;
