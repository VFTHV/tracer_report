import React, { useState, useEffect } from 'react';
import { AllPassData } from './logics/DataProcessor';

interface DisplayTableProps {
  data: AllPassData;
  onDataUpdate: (updatedData: AllPassData) => void;
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
  const [maxPeak, setMaxPeak] = useState(passDataState.maxPeakDepth);
  const [remark, setRemark] = useState(passDataState.remark);

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
      maxPeakDepth: event.target.value,
    });
    onDataUpdate({
      ...passDataState,
      maxPeakDepth: event.target.value,
    });
  };

  const handleRemarkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedRemark = { ...remark, ['remark']: event.target.value };
    setRemark(updatedRemark);
    setPassDataState({
      ...passDataState,
      remark: updatedRemark,
    });
    onDataUpdate({
      ...passDataState,
      remark: updatedRemark,
    });
  };

  return (
    <tr>
      <th scope="row" className="text-nowrap py-0">
        Pass {data.runNo}:
      </th>
      <td className="p-0">
        <input
          type="number"
          className="col p-0 border-0 text-center bg-transparent"
          value={depthStart ? depthStart : 0}
          onChange={handleDepthStartChange}
        />
      </td>
      <td className="p-0">
        <input
          type="text"
          className="col p-0 border-0 text-center bg-transparent"
          value={timeStart}
          onChange={handleTimeStartChange}
        />
      </td>
      <td className="p-0">
        <input
          type="number"
          className="col p-0 border-0 text-center bg-transparent"
          value={depthFinish ? depthFinish : 0}
          onChange={handleDepthFinishChange}
        />
      </td>
      <td className="p-0">
        <input
          className="col p-0 border-0 text-center bg-transparent"
          type="text"
          value={timeFinish}
          onChange={handleTimeFinishChange}
        />
      </td>
      <td className="p-0">
        <input
          className="col p-0 border-0 text-center bg-transparent"
          type="text"
          value={logSpeed ? logSpeed : 0}
          onChange={handleLogSpeedChange}
        />
      </td>
      <td className="p-0">
        <input
          className="col p-0 border-0 text-center bg-transparent"
          type="text"
          value={maxPeak}
          onChange={handleMaxPeakChange}
        />
      </td>
      <td className="p-0">
        <input
          className="col p-0 border-0 text-center bg-transparent"
          type="text"
          value={remark.remark}
          onChange={handleRemarkChange}
        />
      </td>
    </tr>
  );
};

export default DisplayTable;
