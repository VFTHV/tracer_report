import React, { useState } from 'react';
import { LasFileReader } from './logics/LasFileReader';

import { AllPassData } from './logics/DataProcessor';
import { HeaderInfo } from './logics/HeaderProcessor';
import { Standards } from './logics/Standards';
import Instructions from './Instructions';

function FileProcessor(props: {
  setPassData: React.Dispatch<React.SetStateAction<AllPassData[]>>;
  setHeader: React.Dispatch<React.SetStateAction<HeaderInfo>>;
  setFileName: React.Dispatch<React.SetStateAction<string>>;
  setStandard: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [totalDepth, setTotalDepth] = useState(0);
  const [standard, setStandard] = useState(Standards.Texas);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setInputFile(event.target.files[0]);
    }
  };

  const handleStandardChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setStandard(event.target.value);
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
        props.setStandard(standard);
      });
    }
  };

  const hasFile = Boolean(inputFile);

  return (
    <div className="bg-success text-light">
      <form onSubmit={handleSubmit} className="p-3 font-weight-bold">
        <h1>Free Radioactive Tracer Reporting Tool</h1>
        <div className="row">
          <div className="col-12 col-sm-6 col-lg-3 my-2">
            <label className="mr-2" htmlFor="input-file">
              Step 1. Input .las*:
            </label>
            <input
              id="input-file"
              name="input-file"
              type="file"
              onChange={handleFileChange}
              accept=".las"
            />
          </div>

          <div className="col-12 col-sm-6 col-lg-3 my-2">
            <label htmlFor="output-file" className="mr-2">
              Step 2. Name Output File:
            </label>
            <input
              className="form-control"
              id="output-file"
              name="output-file"
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Optional"
            />
          </div>

          <div className="col-12 col-sm-6 col-lg-3 my-2">
            <label htmlFor="total-depth" className="mr-2">
              Step 3. Input Total Depth:
            </label>
            <input
              className="form-control"
              id="total-depth"
              type="number"
              value={totalDepth === 0 ? '' : totalDepth}
              onChange={(e) => setTotalDepth(parseFloat(e.target.value))}
              placeholder="Optional"
            />
          </div>

          <div className="col-12 col-sm-6 col-lg-3 my-2">
            <label htmlFor="state-standard" className="mr-2">
              Step 4. Choose State Standard*:
            </label>
            <select
              className="custom-select"
              id="state-standard"
              name="state-standard"
              value={standard}
              onChange={handleStandardChange}
            >
              <option value={Standards.Texas}>{Standards.Texas}</option>
              <option value={Standards.Louisiana}>{Standards.Louisiana}</option>
            </select>
          </div>

          <Instructions />
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
