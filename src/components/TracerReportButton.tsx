import React, { FC } from 'react';
import { ReportGenerator } from '../logics/ReportGenerator';
import { useSelector } from 'react-redux';
import { StoreState } from '../store';

interface TracerReportProps {
  enabled: boolean;
  isVisible: string;
}

const TracerReportButton: FC<TracerReportProps> = ({ enabled, isVisible }) => {
  const { reportablePasses, reportableHeader } = useSelector(
    (state: StoreState) => state.report
  );
  const { fileName, standard } = useSelector(
    (state: StoreState) => state.tracer
  );

  const generateReport = () => {
    ReportGenerator.tracerReport(
      reportablePasses,
      reportableHeader,
      fileName,
      standard
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
