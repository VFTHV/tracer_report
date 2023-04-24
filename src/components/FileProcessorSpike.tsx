import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  StoreState,
  changeCurve,
  changeDepthCurve,
  setPlotData,
} from '../store';
import { LasFileReader } from '../logics/LasFileReader';

function FileProcessorSpike() {
  const [inputFile, setInputFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setInputFile(event.target.files[0]);
    }
  };

  const dispatch = useDispatch();

  const { depthCurve, curveToCorrect } = useSelector(
    (state: StoreState) => state.spike
  );

  const hasFile = Boolean(inputFile);
  const isVisible = !hasFile && 'd-none';

  const handleShowLog = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputFile) {
      alert('Please select a file');
    } else {
      const reader = new LasFileReader(inputFile);
      reader.readSpike(curveToCorrect, depthCurve).then(() => {
        dispatch(setPlotData(reader.toPlot));
      });
    }
  };

  return (
    <div className="bg-success text-light p-3">
      <form className="font-weight-bold" onSubmit={handleShowLog}>
        <h1>Free Time Stations To Depth .las Converting Tool</h1>
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
            <label className="mr-2" htmlFor="output-file">
              Step 2. Curve to Correct*:
            </label>
            <input
              className="form-control"
              id="output-file"
              name="output-file"
              type="text"
              value={curveToCorrect}
              onChange={(e) => dispatch(changeCurve(e.target.value))}
              placeholder="Curve Name"
            />
          </div>
          <div className="col-12 col-sm-6 col-lg-3 my-2">
            <label className="mr-2" htmlFor="output-file">
              Step 3. Depth Curve Name*:
            </label>
            <input
              className="form-control"
              id="output-file"
              name="output-file"
              type="text"
              value={depthCurve}
              onChange={(e) => dispatch(changeDepthCurve(e.target.value))}
              placeholder="ADPTH"
            />
          </div>
          <div className={`col-12 col-sm-6 col-lg-3 my-2 ${isVisible}`}>
            <label className="d-block">Step 3.</label>
            <button
              type="submit"
              className="btn btn-outline-dark bg-light"
              disabled={!hasFile}
            >
              Show Log
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default FileProcessorSpike;
