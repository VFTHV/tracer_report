import React, { FormEvent, useState } from 'react';
import { LasFileReader } from '../logics/LasFileReader';
import { useDispatch, useSelector } from 'react-redux';
import { changeTtdFileName, setData, StoreState } from '../store';
import TTDReportButton from './TTDReportButton';

export default function FileProcessorTTD() {
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [minSamples, setMinSamples] = useState<number>(50);

  const dispatch = useDispatch();
  const { fileName } = useSelector((state: StoreState) => state.ttd);

  // const [step, setStep] = useState(0);
  // const [resampleDisabled, setResampleDisabled] = useState(true);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setInputFile(event.target.files[0]);
    }
  };

  const handleLasConvert = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputFile) {
      alert('Please select a file');
    } else {
      const reader = new LasFileReader(
        inputFile,
        undefined,
        undefined,
        minSamples
      );
      reader.readTimeToDepth().then(() => {
        dispatch(setData(reader.converted));
      });
    }
  };

  const hasFile = Boolean(inputFile);

  return (
    <div className="bg-success text-light p-3">
      <form className="font-weight-bold" onSubmit={handleLasConvert}>
        <h1>Free Time Stations To Depth .las Converting Tool</h1>
        <div className="row">
          <div className="col-12 col-sm-6 col-lg-3 my-2">
            <label className="mr-2" htmlFor="input-file">
              Step 1. Input non-wrapped .las*:
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
            <label className="mr-2" htmlFor="output-file">
              Step 2. Name Output File:
            </label>
            <input
              className="form-control"
              id="output-file"
              name="output-file"
              type="text"
              value={fileName}
              onChange={(e) => dispatch(changeTtdFileName(e.target.value))}
              placeholder="Optional"
            />
          </div>
          <div className="col-12 col-sm-6 col-lg-3 my-2">
            <label className="mr-2" htmlFor="output-file">
              Step 3. Minimum samples per station:
            </label>
            <input
              className="form-control"
              id="output-file"
              name="output-file"
              type="number"
              value={minSamples || ''}
              onChange={(e) => setMinSamples(+e.target.value)}
              placeholder="Required"
            />
          </div>
          <div className={`col-12 col-sm-6 col-lg-3 my-2`}>
            <label className="d-block">Step 4.*</label>
            <button
              type="submit"
              className="btn btn-outline-dark bg-light"
              disabled={!hasFile}
            >
              Convert .LAS File
            </button>
          </div>
        </div>
      </form>
      <TTDReportButton />
    </div>
  );
}

{
  /* <label>
  Output File Name (not mandatory):
  <input
    type="text"
    value={fileName}
    onChange={(e) => setFileName(e.target.value)}
  />
</label> */
}

{
  /* <label>
Resample data between depth points?
<input
type="checkbox"
checked={resampleDisabled}
onChange={() => setResampleDisabled(!resampleDisabled)}
/>
</label>
<br />
<label>
Set depth distance between samples to resample and interpolate the data
(not mandatory):
<input
type="number"
value={step}
onChange={(e) => setStep(parseFloat(e.target.value))}
disabled={!resampleDisabled}
/>
</label> */
}
