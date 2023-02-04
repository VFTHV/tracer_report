import React from 'react';
import DisplayHeader from './DisplayHeader';
import DisplayTable from './DisplayTable';
import { PassInfo } from './logics/DataProcessor';
import { HeaderInfo } from './logics/HeaderProcessor';

interface DisplayDataProps {
  passData: Array<PassInfo>;
  header: HeaderInfo;
}

const DisplayData: React.FC<DisplayDataProps> = ({ passData, header }) => {
  return (
    <div>
      {Object.keys(header).length ? <DisplayHeader header={header} /> : null}
      {passData.map((pass: PassInfo) => (
        <DisplayTable key={Math.random()} data={pass} />
      ))}
    </div>
  );
};

export default DisplayData;
