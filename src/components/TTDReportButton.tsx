import React from 'react';
import { ReportGenerator } from '../logics/ReportGenerator';
import { useSelector } from 'react-redux';
import { StoreState } from '../store';

function TTDReportButton() {
  const {
    depthConvertedData,
    convertedColHeader,
    depthConvertedHeader,
    fileName,
  } = useSelector((state: StoreState) => state.ttd);

  const generateReport = () => {
    ReportGenerator.timeToDepthReport(
      depthConvertedData,
      convertedColHeader,
      depthConvertedHeader,
      fileName
    );
  };

  const enabled =
    depthConvertedData && convertedColHeader && depthConvertedHeader;

  const isVisible = enabled ? 'd-block' : 'd-none';

  return (
    <div className={`col-12 col-sm-6 col-lg-3 my-2 ${isVisible}`}>
      <label className="d-block">Step 4.</label>
      <button
        type="submit"
        className={`btn btn-danger`}
        disabled={!enabled}
        onClick={generateReport}
      >
        Download Converted File
      </button>
    </div>
  );
}

export default TTDReportButton;
