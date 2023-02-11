import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import DisplayHeader from './DisplayHeader';
import DisplayTable from './DisplayTable';
import { PassInfo } from './logics/DataProcessor';
import { HeaderInfo } from './logics/HeaderProcessor';
import { ReportGenerator } from './logics/ReportGenerator';
import TableHead from './TableHead';

interface DisplayDataProps {
  passData: Array<PassInfo>;
  header: HeaderInfo;
}

const DisplayData: React.FC<DisplayDataProps> = ({ passData, header }) => {
  const hasHeader = Object.keys(header).length;
  const hasData = passData.length;
  const enabled = Boolean(hasData) && Boolean(hasHeader);

  const [reportData, setReportData] = useState(passData);
  const [headerData, setHeaderData] = useState(header);

  useEffect(() => {
    setReportData(passData);
  }, [passData]);
  useEffect(() => {
    setHeaderData(header);
  }, [header]);

  const updatePassData = (updatedData: PassInfo, index: number) => {
    const newData = passData;
    newData[index] = updatedData;

    setReportData(newData);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    ReportGenerator.report(reportData, headerData);
  };

  return (
    <form onSubmit={(e) => onSubmit(e)}>
      {hasHeader ? (
        <DisplayHeader
          onHeaderUpdate={(headerInfo: HeaderInfo) => setHeaderData(headerInfo)}
          header={header}
        />
      ) : null}

      <table className="table table-striped table-bordered">
        <TableHead />

        <tbody>
          {passData.map((pass: PassInfo, index) => (
            <DisplayTable
              key={Math.random()}
              data={pass}
              onDataUpdate={(updatedData: PassInfo) =>
                updatePassData(updatedData, index)
              }
            />
          ))}
        </tbody>
      </table>

      <button type="submit" disabled={!enabled}>
        Export to xlsx
      </button>
    </form>
  );
};

export default DisplayData;
