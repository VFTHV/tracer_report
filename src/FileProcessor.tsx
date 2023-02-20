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

  const hasFile = Boolean(inputFile);

  return (
    <div className="bg-success text-light">
      <form onSubmit={handleSubmit} className="p-3 font-weight-bold">
        <h1>Free Radioactive Tracer Reporting Tool</h1>
        <div className="d-flex justify-content-start my-2">
          <label className="mr-2" htmlFor="input-file">
            Input File:
          </label>
          <input
            id="input-file"
            type="file"
            onChange={handleFileChange}
            accept=".las"
          />
        </div>

        <div className="d-flex justify-content-start my-2">
          <label htmlFor="output-file" className="mr-2">
            Output File Name (not mandatory):
          </label>
          <input
            id="output-file"
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
        </div>

        <div className="d-flex justify-content-start my-2">
          <label htmlFor="total-depth" className="mr-2">
            Total Depth (not mandatory):
          </label>
          <input
            id="total-depth"
            type="number"
            value={totalDepth === 0 ? '' : totalDepth}
            onChange={(e) => setTotalDepth(parseFloat(e.target.value))}
          />
        </div>
        <button
          type="submit"
          className="btn btn-outline-dark bg-light"
          disabled={!hasFile}
        >
          Process File
        </button>
      </form>
    </div>
  );
}

export default FileProcessor;
