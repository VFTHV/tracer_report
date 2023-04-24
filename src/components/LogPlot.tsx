import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useSelector } from 'react-redux';
import { StoreState } from '../store';

const LogPlot = () => {
  const { plotData, curveToCorrect, depthCurve } = useSelector(
    (state: StoreState) => state.spike
  );
  const newPlot = plotData.filter((_, i) => i < 1000 && i > 5);

  const isVisible = Boolean(plotData.length) ? '' : 'd-none';

  return (
    <div className={isVisible}>
      <LineChart width={500} height={1000} data={plotData} layout="vertical">
        <XAxis type="number" domain={['dataMin', 'dataMax']} />
        <YAxis
          type="number"
          dataKey={depthCurve}
          domain={['dataMin', 'dataMax']}
        />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend verticalAlign="top" height={36} />
        <Line dataKey={curveToCorrect} name={curveToCorrect} dot={false} />
      </LineChart>
    </div>
  );
};

export default LogPlot;
