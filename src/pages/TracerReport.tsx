import React from 'react';

import FileProcessorTracer from '../components/FileProcessorTracer';
import DisplayData from '../components/DisplayData';

export default function TracerReport() {
  return (
    <>
      <FileProcessorTracer />
      <DisplayData />
    </>
  );
}
