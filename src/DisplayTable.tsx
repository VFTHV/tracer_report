import React, { useState, useEffect } from 'react';
import { PassInfo } from './logics/DataProcessor';

interface DisplayTableProps {
  data: PassInfo;
}

const DisplayTable: React.FC<DisplayTableProps> = ({ data }) => {
  const [passDataState, setPassDataState] = useState(data);
  console.log(data);

  useEffect(() => {
    setPassDataState(data);
  }, [data]);

  const [depthStart, setDepthStart] = useState(passDataState.depthStart || 0);
  const [timeStart, setTimeStart] = useState(passDataState.timeStart || '');
  const [depthFinish, setDepthFinish] = useState(
    passDataState.depthFinish || 0
  );
  const [timeFinish, setTimeFinish] = useState(passDataState.timeFinish || '');
  const [logSpeed, setLogSpeed] = useState(passDataState.logSpeed || 0);
  const [maxPeak, setMaxPeak] = useState(passDataState.maxPeak || 0);

  const handleDepthStartChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDepthStart(parseFloat(event.target.value));
  };

  const handleTimeStartChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTimeStart(event.target.value);
  };

  const handleDepthFinishChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDepthFinish(parseFloat(event.target.value));
  };

  const handleTimeFinishChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTimeFinish(event.target.value);
  };

  const handleLogSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLogSpeed(event.target.value);
  };

  const handleMaxPeakChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPeak(event.target.value);
  };

  return (
    <>
      <label>
        Pass {data.runNo} Data:
        <input
          type="number"
          value={depthStart}
          onChange={handleDepthStartChange}
        />
      </label>
      <input type="text" value={timeStart} onChange={handleTimeStartChange} />
      <input
        type="number"
        value={depthFinish}
        onChange={handleDepthFinishChange}
      />
      <input type="text" value={timeFinish} onChange={handleTimeFinishChange} />
      <input type="number" value={logSpeed} onChange={handleLogSpeedChange} />
      <input type="number" value={maxPeak} onChange={handleMaxPeakChange} />
      <br />
    </>
  );
};

export default DisplayTable;
