import { report } from 'process';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import DisplayHeader from './DisplayHeader';
import DisplayTable from './DisplayTable';
import { PassInfo } from './logics/DataProcessor';
import { HeaderInfo } from './logics/HeaderProcessor';
import { ReportGenerator } from './logics/ReportGenerator';

interface DisplayDataProps {
  passData: Array<PassInfo>;
  header: HeaderInfo;
}

const DisplayData: React.FC<DisplayDataProps> = ({ passData, header }) => {
  const hasHeader = Object.keys(header).length;
  const hasData = passData.length;

  const [reportData, setReportData] = useState(passData);

  useEffect(() => {
    setReportData(passData);
  }, [passData]);

  const updatePassData = (updatedData: PassInfo, index: number) => {
    const newData = passData;
    newData[index] = updatedData;
    console.clear();
    console.log(reportData[0]);
    console.log(reportData[1]);
    setReportData(newData);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    ReportGenerator.report(reportData);
  };

  return (
    <form onSubmit={(e) => onSubmit(e)}>
      {hasHeader ? <DisplayHeader header={header} /> : null}
      <br />
      {passData.map((pass: PassInfo, index) => (
        <DisplayTable
          key={Math.random()}
          data={pass}
          onDataUpdate={(updatedData: PassInfo) =>
            updatePassData(updatedData, index)
          }
        />
      ))}
      {hasData && hasHeader ? <button type="submit">Submit</button> : ''}
    </form>
  );
};

export default DisplayData;
