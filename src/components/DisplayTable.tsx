import React, { ChangeEvent, useState, FC } from 'react';
import { AllPassData } from '../logics/TracerProcessor';
import { useDispatch } from 'react-redux';
import { modifyReportablePass } from '../store';
// import { nanoid } from '@reduxjs/toolkit';

interface DisplayTableProps {
  pass: AllPassData;
  index: number;
}

const DisplayTable: FC<DisplayTableProps> = ({ pass, index }) => {
  const dispatch = useDispatch();

  const [passData, setPass] = useState(pass);

  const {
    depthStart,
    depthFinish,
    timeStart,
    timeFinish,
    logSpeed,
    maxPeakDepth,
    remark,
  } = passData;

  const onChange = (e: ChangeEvent<HTMLInputElement>, key: string) => {
    const modifiedPass = { ...passData };
    const value =
      typeof modifiedPass[key] === 'number' ? +e.target.value : e.target.value;
    modifiedPass[key] = value;

    setPass(modifiedPass);
    const payload = { index, modifiedPass };
    dispatch(modifyReportablePass(payload));
  };
  // renderInputs - INPUTS LOSE FOCUS AFTER TYPING ONE CHARACTER
  // const renderInputs = () => {
  //   const toRender = {
  //     depthStart,
  //     timeStart,
  //     depthFinish,
  //     timeFinish,
  //     logSpeed,
  //     maxPeakDepth,
  //     remark,
  //   };
  //   const keys = Object.keys(toRender);
  //   const values = Object.values(toRender);

  //   return keys.map((key, index) => {
  //     const type = Boolean(+values[index]) ? 'number' : 'text';
  //     const isNumber = Boolean(+values[index]);

  //     return (
  //       <td key={nanoid()} className="p-0">
  //         <input
  //           type={type}
  //           className="col p-0 border-0 text-center bg-transparent"
  //           value={passData[key] || ''}
  //           onChange={(e) => onChange(e, key)}
  //         />
  //       </td>
  //     );
  //   });
  // };

  return (
    <tr>
      <th scope="row" className="text-nowrap py-0">
        {pass.runNo}
      </th>

      <td className="p-0">
        <input
          type="number"
          className="col p-0 border-0 text-center bg-transparent"
          value={depthStart || ''}
          onChange={(e) => onChange(e, 'depthStart')}
        />
      </td>
      <td className="p-0">
        <input
          type="text"
          className="col p-0 border-0 text-center bg-transparent"
          value={timeStart || ''}
          onChange={(e) => onChange(e, 'timeStart')}
        />
      </td>
      <td className="p-0">
        <input
          type="number"
          className="col p-0 border-0 text-center bg-transparent"
          value={depthFinish || ''}
          onChange={(e) => onChange(e, 'depthFinish')}
        />
      </td>
      <td className="p-0">
        <input
          className="col p-0 border-0 text-center bg-transparent"
          type="text"
          value={timeFinish}
          onChange={(e) => onChange(e, 'timeFinish')}
        />
      </td>
      <td className="p-0">
        <input
          className="col p-0 border-0 text-center bg-transparent"
          type="text"
          value={logSpeed}
          onChange={(e) => onChange(e, 'logSpeed')}
        />
      </td>
      <td className="p-0">
        <input
          className="col p-0 border-0 text-center bg-transparent"
          type="text"
          value={maxPeakDepth}
          onChange={(e) => onChange(e, 'maxPeakDepth')}
        />
      </td>
      <td className="p-0">
        <input
          className="col p-0 border-0 text-center bg-transparent"
          type="text"
          value={remark}
          onChange={(e) => onChange(e, 'remark')}
        />
      </td>

      {/* {renderInputs()} */}
    </tr>
  );
};

export default DisplayTable;
