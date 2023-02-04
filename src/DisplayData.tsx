import React, { useState } from 'react';
import { PassInfo } from './logics/DataProcessor';
import { HeaderInfo } from './logics/HeaderProcessor';

interface DisplayDataProps {
  passData: Array<PassInfo>;
  header: HeaderInfo;
}

const DisplayData: React.FC<DisplayDataProps> = ({ passData, header }) => {
  const renderHeader = () => {
    return (
      <>
        <label>
          Date:
          <input type="text" value={header.date} />
        </label>
        <label>
          Company:
          <input type="text" value={header.company} />
        </label>
        <label>
          Well Name:
          <input type="text" value={header.wellName} />
        </label>
        <label>
          Plant Location:
          <input type="text" value={header.fieldName} />
        </label>
        <label>
          Equipment Location:
          <input type="text" value={header.location} />
        </label>
        <label>
          County:
          <input type="text" value={header.countyName} />
        </label>
        <label>
          State:
          <input type="text" value={header.state} />
        </label>
      </>
    );
  };

  return (
    <div>
      {renderHeader()}
      {passData.map((pass) => (
        <div key={Math.random()}>
          <label>
            Pass {pass.runNo} Data:
            <input type="text" value={pass.depthStart} />
          </label>
          <input type="text" value={pass.timeStart} />
          <input type="text" value={pass.depthStart} />
          <input type="text" value={pass.timeFinish} />
          <input type="text" value={pass.depthFinish} />
          <br />
        </div>
      ))}
    </div>
  );
};

export default DisplayData;
