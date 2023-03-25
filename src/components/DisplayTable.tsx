import React, { ChangeEvent, useState, FC } from 'react';
import { AllPassData } from '../logics/TracerProcessor';
import { useDispatch } from 'react-redux';
import { modifyReportablePass } from '../store';
import { nanoid } from '@reduxjs/toolkit';

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

  // console.log('re-render Display Table');

  const onChange = (e: ChangeEvent<HTMLInputElement>, key: string) => {
    const modifiedPass = { ...passData };
    const value =
      typeof modifiedPass[key] === 'number' ? +e.target.value : e.target.value;
    modifiedPass[key] = value;

    setPass(modifiedPass);
    const payload = { index, modifiedPass };
    dispatch(modifyReportablePass(payload));
  };

  const renderInputs = () => {
    const toRender = {
      depthStart,
      timeStart,
      depthFinish,
      timeFinish,
      logSpeed,
      maxPeakDepth,
      remark,
    };
    const keys = Object.keys(toRender);
    const values = Object.values(toRender);

    return keys.map((key, index) => {
      const type = Boolean(+values[index]) ? 'number' : 'text';
      const isNumber = Boolean(+values[index]);

      return (
        <td key={nanoid()} className="p-0">
          <input
            type={type}
            className="col p-0 border-0 text-center bg-transparent"
            value={passData[key] || ''}
            onChange={(e) => onChange(e, key)}
          />
        </td>
      );
    });
  };

  return (
    <tr>
      <th scope="row" className="text-nowrap py-0">
        {pass.runNo}
      </th>
      {renderInputs()}
    </tr>
  );
};

export default DisplayTable;
