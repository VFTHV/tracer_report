import React, { useState } from 'react';

import FileProcessor from './FileProcessor';
import DisplayData from './DisplayData';
import { AllPassData } from './logics/DataProcessor';
import { HeaderInfo } from './logics/HeaderProcessor';

export default function App() {
  const [passData, setPassData] = useState<AllPassData[]>([]);
  const [header, setHeader] = useState<HeaderInfo>({} as HeaderInfo);
  const [fileName, setFileName] = useState('');
  console.log(fileName);

  return (
    <div className="container-fluid">
      <FileProcessor
        setPassData={setPassData}
        setHeader={setHeader}
        setFileName={setFileName}
      />
      <DisplayData passData={passData} header={header} fileName={fileName} />
    </div>
  );
}
