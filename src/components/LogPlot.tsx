import React from 'react';
import {
  LineChart,
  Line,
  ReferenceLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useSelector } from 'react-redux';
import { StoreState } from '../store';

const data = [
  { ADPTH: 1000, DET2: 45, resistivity: 100 },
  { ADPTH: 1001, DET2: 42, resistivity: 110 },
  { ADPTH: 1002, DET2: 50, resistivity: 105 },
  { ADPTH: 1003, DET2: 33, resistivity: 100 },
  { ADPTH: 1004, DET2: 43, resistivity: 93 },
  // add more data points here
];

const LogPlot = () => {
  const { plotData } = useSelector((state: StoreState) => state.spike);
  const newPlot = plotData.filter((_, i) => i < 1000 && i > 5);
  const height = (newPlot[0].ADPTH - newPlot[newPlot.length - 1].ADPTH) * 10;
  console.log(height);
  return (
    <LineChart width={500} height={height} data={newPlot} layout="vertical">
      <XAxis type="number" />
      <YAxis type="number" dataKey="ADPTH" domain={['auto', 'auto']} />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip />
      <Legend verticalAlign="top" height={36} />
      <Line dataKey="DET2" name="DET2" dot={false} />
      {/* <Line
        type="monotone"
        dataKey="resistivity"
        stroke="#82ca9d"
        activeDot={{ r: 8 }}
        name="Resistivity"
      /> */}
    </LineChart>
  );
};

export default LogPlot;
