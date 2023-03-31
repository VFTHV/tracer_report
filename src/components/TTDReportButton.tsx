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

  return (
    <button
      type="submit"
      className="btn btn-success"
      disabled={!enabled}
      onClick={generateReport}
    >
      Convert Las File
    </button>
  );
}

export default TTDReportButton;
