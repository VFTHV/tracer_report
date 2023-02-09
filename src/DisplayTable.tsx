import React, { useState, useEffect } from 'react';
import { PassInfo } from './logics/DataProcessor';

interface DisplayTableProps {
  data: PassInfo;
  onDataUpdate: (updatedData: PassInfo) => void;
}

const DisplayTable: React.FC<DisplayTableProps> = ({ data, onDataUpdate }) => {
  const [passDataState, setPassDataState] = useState(data);

  useEffect(() => {
    setPassDataState(data);
  }, [data]);

  const [depthStart, setDepthStart] = useState(passDataState.depthStart);
  const [timeStart, setTimeStart] = useState(passDataState.timeStart);
  const [depthFinish, setDepthFinish] = useState(passDataState.depthFinish);
  const [timeFinish, setTimeFinish] = useState(passDataState.timeFinish);
  const [logSpeed, setLogSpeed] = useState(passDataState.logSpeed);
  const [maxPeak, setMaxPeak] = useState(passDataState.maxPeak);

  const handleDepthStartChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDepthStart(Number(event.target.value));
    setPassDataState({
      ...passDataState,
      depthStart: Number(event.target.value),
    });
    onDataUpdate({
      ...passDataState,
      depthStart: Number(event.target.value),
    });
  };

  const handleTimeStartChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTimeStart(event.target.value);
    setPassDataState({
      ...passDataState,
      timeStart: event.target.value,
    });
    onDataUpdate({
      ...passDataState,
      timeStart: event.target.value,
    });
  };

  const handleDepthFinishChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDepthFinish(Number(event.target.value));
    setPassDataState({
      ...passDataState,
      depthFinish: Number(event.target.value),
    });
    onDataUpdate({
      ...passDataState,
      depthFinish: Number(event.target.value),
    });
  };

  const handleTimeFinishChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTimeFinish(event.target.value);
    setPassDataState({
      ...passDataState,
      timeFinish: event.target.value,
    });
    onDataUpdate({
      ...passDataState,
      timeFinish: event.target.value,
    });
  };

  const handleLogSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLogSpeed(event.target.value);
    setPassDataState({
      ...passDataState,
      logSpeed: event.target.value,
    });
    onDataUpdate({
      ...passDataState,
      logSpeed: event.target.value,
    });
  };

  const handleMaxPeakChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPeak(event.target.value);
    setPassDataState({
      ...passDataState,
      maxPeak: event.target.value,
    });
    onDataUpdate({
      ...passDataState,
      maxPeak: event.target.value,
    });
  };

  return (
    <>
      <label>
        Pass {data.runNo} Data:
        <input
          type="number"
          value={depthStart ? depthStart : 0}
          onChange={handleDepthStartChange}
        />
      </label>
      <input type="text" value={timeStart} onChange={handleTimeStartChange} />
      <input
        type="number"
        value={depthFinish ? depthFinish : 0}
        onChange={handleDepthFinishChange}
      />
      <input type="text" value={timeFinish} onChange={handleTimeFinishChange} />
      <input
        type="text"
        value={logSpeed ? logSpeed : 0}
        onChange={handleLogSpeedChange}
      />
      <input
        type="text"
        value={maxPeak ? maxPeak : 0}
        onChange={handleMaxPeakChange}
      />
      <br />
    </>
  );
};

export default DisplayTable;
