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
  standard: string;
}

const DisplayData: React.FC<DisplayDataProps> = ({
  passData,
  header,
  fileName,
  standard,
}) => {
  const hasHeader = Object.keys(header).length;
  const hasData = passData.length;
  const enabled = Boolean(hasData) && Boolean(hasHeader);

  const [tableData, setTableData] = useState(passData);
  const [headerData, setHeaderData] = useState(header);

  useEffect(() => {
    setTableData(passData);
    setHeaderData(header);
    window.scrollTo(0, document.body.scrollHeight);
  }, [passData, header]);

  const updatePassData = (updatedData: AllPassData, index: number) => {
    const newData = passData;
    newData[index] = updatedData;
    setTableData(newData);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    ReportGenerator.report(tableData, headerData, fileName, standard);
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
        {hasData ? <TableHead /> : ''}

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

      <button type="submit" className="btn btn-success" disabled={!enabled}>
        Create Spreadsheet
      </button>
    </form>
  );
};

export default DisplayData;
