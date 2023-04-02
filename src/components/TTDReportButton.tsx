import React, { FormEvent } from 'react';
import { ReportGenerator } from '../logics/ReportGenerator';
import { useSelector } from 'react-redux';
import { StoreState } from '../store';
import { useForm } from '@formspree/react';

function TTDReportButton() {
  const {
    depthConvertedData,
    convertedColHeader,
    depthConvertedHeader,
    fileName,
  } = useSelector((state: StoreState) => state.ttd);

  const [, handleSubmit] = useForm('xoqzknzr');

  const generateReport = (e: FormEvent) => {
    e.preventDefault();
    ReportGenerator.timeToDepthReport(
      depthConvertedData,
      convertedColHeader,
      depthConvertedHeader,
      fileName
    );
    handleSubmit(e);
  };

  const enabled =
    depthConvertedData && convertedColHeader && depthConvertedHeader;

  const isVisible = enabled ? 'd-inline' : 'd-none';

  const s = depthConvertedHeader;

  return (
    <div className={`col-12 col-sm-6 col-lg-3 my-2 ${isVisible}`}>
      <form onSubmit={generateReport}>
        <label className="d-block">Step 4.</label>
        <button type="submit" className={`btn btn-danger`} disabled={!enabled}>
          Download Converted File
        </button>
        <textarea
          id="message"
          name="message"
          value={s.substring(0, s.indexOf('STEP'))}
          readOnly
          style={{ display: 'none' }}
        />
      </form>
    </div>
  );
}

export default TTDReportButton;
