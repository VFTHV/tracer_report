import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import DisplayHeader from './DisplayHeader';
import DisplayTable from './DisplayTable';
import { AllPassData } from './logics/DataProcessor';
import { HeaderInfo } from './logics/HeaderProcessor';
import { ReportGenerator } from './logics/ReportGenerator';
import TableHead from './TableHead';

interface DisplayDataProps {
  passData: Array<AllPassData>;
  header: HeaderInfo;
  fileName: string;
}

const DisplayData: React.FC<DisplayDataProps> = ({
  passData,
  header,
  fileName,
}) => {
  const hasHeader = Object.keys(header).length;
  const hasData = passData.length;
  const enabled = Boolean(hasData) && Boolean(hasHeader);

  const [tableData, setTableData] = useState(passData);
  const [headerData, setHeaderData] = useState(header);

  useEffect(() => {
    setTableData(passData);
  }, [passData]);
  useEffect(() => {
    setHeaderData(header);
  }, [header]);

  const updatePassData = (updatedData: AllPassData, index: number) => {
    const newData = passData;
    newData[index] = updatedData;

    setTableData(newData);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    ReportGenerator.report(tableData, headerData, fileName);
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
        {passData.length ? <TableHead /> : ''}

        <tbody>
          {passData.map((pass: AllPassData, index) => (
            <DisplayTable
              key={Math.random()}
              data={pass}
              onDataUpdate={(updatedData: AllPassData) =>
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
