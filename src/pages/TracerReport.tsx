import React, { useState } from 'react';

import TracerFileProcessor from '../components/TracerFileProcessor';
import DisplayData from '../components/DisplayData';
import { AllPassData } from '../logics/TracerProcessor';
import { HeaderInfo } from '../logics/HeaderProcessor';
import { Standards } from '../logics/Standards';

export default function TracerReport() {
  const [passData, setPassData] = useState<AllPassData[]>([]);
  const [header, setHeader] = useState<HeaderInfo>({} as HeaderInfo);
  const [fileName, setFileName] = useState('');
  const [standard, setStandard] = useState(Standards.Texas);
  return (
    <>
      <TracerFileProcessor
        setPassData={setPassData}
        setHeader={setHeader}
        setFileName={setFileName}
        setStandard={setStandard}
      />
      <DisplayData
        passData={passData}
        header={header}
        fileName={fileName}
        standard={standard}
      />
    </>
  );
}
