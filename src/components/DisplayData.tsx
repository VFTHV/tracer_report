import React, { FC } from 'react';
import DisplayHeader from './DisplayHeader';
import DisplayTable from './DisplayTable';
import { AllPassData } from '../logics/TracerProcessor';

import TableHead from './TableHead';

import { useSelector } from 'react-redux';

import { useForm } from '@formspree/react';
import { StoreState } from '../store';
import TracerReportButton from './TracerReportButton';

const DisplayData: FC = () => {
  const { allPassData, header } = useSelector(
    (state: StoreState) => state.tracer
  );

  const hasHeader = header.date;
  const hasData = allPassData.length;
  const enabled = Boolean(hasData) && Boolean(hasHeader);

  const [, handleSubmit] = useForm('mlekbvbd');

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
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
            <DisplayTable key={Math.random()} pass={pass} index={index} />
          ))}
        </tbody>
      </table>
      <TracerReportButton enabled={enabled} />
    </form>
  );
};

export default DisplayData;
