import React from 'react';
import { AllPassData } from '../logics/TracerProcessor';
import { useDispatch, useSelector } from 'react-redux';
import { setAllPassData, StoreState } from '../store';

interface DisplayTableProps {
  data: AllPassData;
  index: number;
}

const DisplayTable: React.FC<DisplayTableProps> = ({ data, index }) => {
  const dispatch = useDispatch();
  const allPassData = useSelector(
    (state: StoreState) => state.tracer.allPassData
  );
  const {
    depthStart,
    depthFinish,
    timeStart,
    timeFinish,
    logSpeed,
    maxPeakDepth,
    remark,
  } = useSelector((state: StoreState) => {
    const {
      depthStart,
      depthFinish,
      timeStart,
      timeFinish,
      logSpeed,
      maxPeakDepth,
      remark,
    } = state.tracer.allPassData[index];
    return {
      depthStart,
      depthFinish,
      timeStart,
      timeFinish,
      logSpeed,
      maxPeakDepth,
      remark,
    };
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    let value =
      typeof e.target.value === 'string' ? e.target.value : +e.target.value;

    const updatedData = {
      ...allPassData[index],
      [key]: value,
    };
    const newData = [...allPassData];
    newData[index] = updatedData;
    dispatch(setAllPassData(newData));
  };

  const handleRemarkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedRemark = { ...remark, ['remark']: event.target.value };
    const updatedData = {
      ...allPassData[index],
      ['remark']: updatedRemark,
    };

    const newData = [...allPassData];
    newData[index] = updatedData;
    dispatch(setAllPassData(newData));
  };
  console.log('rendering DisplayTable');

  return (
    <tr>
      <th scope="row" className="text-nowrap py-0">
        {data.runNo}
      </th>
      <td className="p-0">
        <input
          type="number"
          className="col p-0 border-0 text-center bg-transparent"
          value={depthStart ? depthStart : 0}
          onChange={(e) => handleChange(e, 'depthStart')}
        />
      </td>
      <td className="p-0">
        <input
          type="text"
          className="col p-0 border-0 text-center bg-transparent"
          value={timeStart}
          onChange={(e) => handleChange(e, 'timeStart')}
        />
      </td>
      <td className="p-0">
        <input
          type="number"
          className="col p-0 border-0 text-center bg-transparent"
          value={depthFinish ? depthFinish : 0}
          onChange={(e) => handleChange(e, 'depthFinish')}
        />
      </td>
      <td className="p-0">
        <input
          className="col p-0 border-0 text-center bg-transparent"
          type="text"
          value={timeFinish}
          onChange={(e) => handleChange(e, 'timeFinish')}
        />
      </td>
      <td className="p-0">
        <input
          className="col p-0 border-0 text-center bg-transparent"
          type="text"
          value={logSpeed ? logSpeed : 0}
          onChange={(e) => handleChange(e, 'logSpeed')}
        />
      </td>
      <td className="p-0">
        <input
          className="col p-0 border-0 text-center bg-transparent"
          type="text"
          value={maxPeakDepth}
          onChange={(e) => handleChange(e, 'maxPeakDepth')}
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
