import React, { FC } from 'react';
import { ReportGenerator } from '../logics/ReportGenerator';
import { useSelector } from 'react-redux';
import { StoreState } from '../store';

interface TracerReportProps {
  enabled: boolean;
  isVisible: string;
}

const TracerReportButton: FC<TracerReportProps> = ({ enabled, isVisible }) => {
  const { reportablePasses, reportableHeader, fileName, standard, logo } =
    useSelector((state: StoreState) => {
      const { reportablePasses, reportableHeader, logo } = state.report;
      const { fileName, standard } = state.tracer;
      return { reportablePasses, reportableHeader, fileName, standard, logo };
    });

  const generateReport = () => {
    ReportGenerator.tracerReport(
      reportablePasses,
      reportableHeader,
      fileName,
      standard,
      logo
    );
  };

  return (
    <button
      type="submit"
      className={`btn btn-danger ${isVisible}`}
      disabled={!enabled}
      onClick={generateReport}
    >
      Create Spreadsheet
    </button>
  );
};

export default TracerReportButton;
