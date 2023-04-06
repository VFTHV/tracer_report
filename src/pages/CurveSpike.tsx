import React from 'react';
import LogPlot from '../components/LogPlot';
import FileProcessorSpike from '../components/FileProcessorSpike';

function CurveSpike() {
  return (
    <div>
      <FileProcessorSpike />
      <LogPlot />
    </div>
  );
}

export default CurveSpike;
