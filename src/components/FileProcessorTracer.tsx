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
import ControlledInput from './ControlledInput';
import FileInput from './FileInput';

function FileProcessorTracer() {
  const [inputFile, setInputFile] = useState<null | File>(null);

  const dispatch = useDispatch();
  const { fileName, standard, totalDepth } = useSelector(
    (state: StoreState) => state.tracer
  );

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      setInputFile(e.target.files[0]);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
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
          <FileInput
            onChange={handleFileChange}
            name="input-file"
            accept=".las"
          >
            Step 1. Multiple-pass .las*:
          </FileInput>

          <ControlledInput
            onChange={(e) => dispatch(changeFileName(e.target.value))}
            name="output-file"
            type="text"
            value={fileName}
            placeholder="Optional"
          >
            Step 2. Name Output File:
          </ControlledInput>

          <ControlledInput
            onChange={(e) =>
              dispatch(changeTotalDepth(parseInt(e.target.value)))
            }
            name="total-depth"
            type="number"
            value={totalDepth === 0 ? '' : totalDepth}
            placeholder="optional"
          >
            Step 3. Input Total Depth:
          </ControlledInput>

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

          <FileInput
            onChange={handleImageChange}
            name="image-file"
            accept=".jpeg, .png"
          >
            Step 5. Add Logo (Optional)
          </FileInput>

          <div className={`col-12 col-sm-6 col-lg-3 my-2 ${isVisible}`}>
            <label className="d-block">Step 6. Process File</label>
            <button
              onClick={handleFileProcess}
              type="button"
              className="btn btn-outline-dark bg-light"
              disabled={!hasFile}
            >
              Process File
            </button>
          </div>

          <Instructions />
        </div>
      </form>
    </div>
  );
}

export default FileProcessorTracer;
