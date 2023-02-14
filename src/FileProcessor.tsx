import React, { useState } from 'react';
import { LasFileReader } from './logics/LasFileReader';

import { AllPassData } from './logics/DataProcessor';
import { HeaderInfo } from './logics/HeaderProcessor';

function FileProcessor(props: {
  setPassData: React.Dispatch<React.SetStateAction<AllPassData[]>>;
  setHeader: React.Dispatch<React.SetStateAction<HeaderInfo>>;
  setFileName: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [totalDepth, setTotalDepth] = useState(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setInputFile(event.target.files[0]);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inputFile) {
      alert('Please select a file');
    } else {
      const reader = new LasFileReader(inputFile, totalDepth);
      reader.read().then(() => {
        props.setPassData(reader.passDataAndRemarks);
        props.setHeader(reader.header);
        props.setFileName(fileName);
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Input File:
        <input type="file" onChange={handleFileChange} accept=".las" />
      </label>
      <br />
      <label>
        Output File Name (not mandatory):
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />
      </label>
      <br />
      <label>
        Total Depth (not mandatory):
        <input
          type="number"
          value={totalDepth === 0 ? '' : totalDepth}
          onChange={(e) => setTotalDepth(parseFloat(e.target.value))}
        />
      </label>
      <br />
      <button type="submit">Process File</button>
    </form>
  );
}

export default FileProcessor;
