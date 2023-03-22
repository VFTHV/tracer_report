import React from 'react';
import DisplayHeader from './DisplayHeader';
import DisplayTable from './DisplayTable';
import { AllPassData } from '../logics/TracerProcessor';
import { ReportGenerator } from '../logics/ReportGenerator';
import TableHead from './TableHead';

import { useDispatch, useSelector } from 'react-redux';

import { useForm } from '@formspree/react';

const DisplayData: React.FC = () => {
  const dispatch = useDispatch();

  const { allPassData, header, fileName, standard } = useSelector(
    ({ tracer: { allPassData, header, fileName, standard } }) => {
      return { allPassData, header, fileName, standard };
    }
  );

  const hasHeader = header.date;
  const hasData = allPassData.length;
  const enabled = Boolean(hasData) && Boolean(hasHeader);

  // const [, handleSubmit] = useForm('mlekbvbd');

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    ReportGenerator.tracerReport(allPassData, header, fileName, standard);
    // handleSubmit(e);
  };

  const headerAsText = Object.values(header).join('; ');

  return (
    <form onSubmit={onSubmit}>
      {hasHeader ? <DisplayHeader /> : null}

      <textarea
        id="message"
        name="message"
        value={headerAsText}
        readOnly
        style={{ display: 'none' }}
      />

      <table className="table table-striped table-bordered">
        {hasData ? <TableHead /> : ''}

        <tbody>
          {allPassData.map((pass: AllPassData, index: number) => (
            <DisplayTable key={Math.random()} data={pass} index={index} />
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
