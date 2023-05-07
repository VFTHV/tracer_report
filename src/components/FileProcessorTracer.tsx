import React, { useState, ChangeEvent } from 'react';
import { LasFileReader } from '../logics/LasFileReader';

import { Standards } from '../logics/Standards';
import Instructions from './Instructions';

import { useDispatch } from 'react-redux';
import {
  changeFileName,
  changeStandard,
  changeTotalDepth,
  setAllPassData,
  setHeader,
  StoreState,
  setLogo,
} from '../store';
import { useSelector } from 'react-redux';

function FileProcessorTracer() {
  const [inputFile, setInputFile] = useState<null | File>(null);

  const dispatch = useDispatch();
  const { fileName, standard, totalDepth } = useSelector(
    (state: StoreState) => state.tracer
  );

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setInputFile(e.target.files[0]);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onloadend = () => {
        dispatch(setLogo(reader.result));
      };
    }
  };

  const handleFileProcess = () => {
    if (!inputFile) {
      alert('Please select a file');
    } else {
      const reader = new LasFileReader(inputFile, totalDepth, standard);
      reader.readTracer().then(() => {
        dispatch(setAllPassData(reader.passDataAndRemarks));
        dispatch(setHeader(reader.header));
      });
    }
  };

  const hasFile = Boolean(inputFile);
  const isVisible = hasFile ? 'd-block' : 'd-none';

  return (
    <div className="bg-success text-light">
      <form className="p-3 font-weight-bold">
        <h1>Free Radioactive Tracer Reporting Tool</h1>
        <div className="row">
          <div className="col-12 col-sm-6 col-lg-3 my-2">
            <label className="mr-2" htmlFor="input-file">
              Step 1. Multiple-pass .las*:
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
              onChange={(e) => dispatch(changeFileName(e.target.value))}
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
              onChange={(e) =>
                dispatch(changeTotalDepth(parseInt(e.target.value)))
              }
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
              onChange={(e) => dispatch(changeStandard(e.target.value))}
            >
              <option value={Standards.Texas}>{Standards.Texas}</option>
              <option value={Standards.Louisiana}>{Standards.Louisiana}</option>
            </select>
          </div>

          <div className={`col-12 col-sm-6 col-lg-3 my-2 ${isVisible}`}>
            <label className="d-block">Step 5. Process File</label>
            <button
              onClick={handleFileProcess}
              type="button"
              className="btn btn-outline-dark bg-light"
              disabled={!hasFile}
            >
              Process File
            </button>
          </div>

          <div className="col-12 col-sm-6 col-lg-3 my-2">
            <label htmlFor="image-file" className="mr-2">
              Step 6. Add Logo (Optional)
            </label>
            <input
              id="image-file"
              name="image-file"
              type="file"
              onChange={handleImageChange}
              accept=".jpeg, .png"
            />
          </div>

          <Instructions />
        </div>
      </form>
    </div>
  );
}

export default FileProcessorTracer;
