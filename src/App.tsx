import React, { useState } from 'react';

import FileProcessor from './FileProcessor';
import DisplayData from './DisplayData';
import { AllPassData } from './logics/DataProcessor';
import { HeaderInfo } from './logics/HeaderProcessor';
import { Standards } from './logics/Standards';

export default function App() {
  const [passData, setPassData] = useState<AllPassData[]>([]);
  const [header, setHeader] = useState<HeaderInfo>({} as HeaderInfo);
  const [fileName, setFileName] = useState('');
  const [standard, setStandard] = useState(Standards.Texas);

  return (
    <div className="container-fluid">
      <FileProcessor
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
    </div>
  );
}
