import React, { useState, useEffect } from 'react';

import { HeaderInfo } from './logics/HeaderProcessor';

interface DisplayHeaderProps {
  header: HeaderInfo;
  onHeaderUpdate: (updatedHeader: HeaderInfo) => void;
}

const DisplayHeader: React.FC<DisplayHeaderProps> = ({
  header,
  onHeaderUpdate,
}) => {
  const [headerData, setHeaderData] = useState(header);

  useEffect(() => {
    setHeaderData(header);
  }, [header]);

  const handleHeaderChange = (field: keyof HeaderInfo, value: string) => {
    setHeaderData({ ...headerData, [field]: value });
    onHeaderUpdate({ ...headerData, [field]: value });
  };

  const renderHeader = () => {
    return (
      <>
        <div className="row my-2">
          <label className="col-2" htmlFor="date">
            Date:
          </label>
          <input
            id="date"
            className="col-3"
            type="text"
            value={headerData.date}
            onChange={(e) => handleHeaderChange('date', e.target.value)}
          />
        </div>
        <div className="row my-2">
          <label className="col-2" htmlFor="company">
            Company:
          </label>
          <input
            id="company"
            className="col-3"
            type="text"
            value={headerData.company}
            onChange={(e) => handleHeaderChange('company', e.target.value)}
          />
        </div>
        <div className="row my-2">
          <label className="col-2" htmlFor="well-name">
            Well Name:
          </label>
          <input
            id="well-name"
            className="col-3"
            type="text"
            value={headerData.well}
            onChange={(e) => handleHeaderChange('well', e.target.value)}
          />
        </div>
        <div className="row my-2">
          <label className="col-2" htmlFor="location">
            Plant/Field:
          </label>
          <input
            id="location"
            className="col-3"
            type="text"
            value={headerData.field}
            onChange={(e) => handleHeaderChange('field', e.target.value)}
          />
        </div>

        <div className="row my-2">
          <label className="col-2" htmlFor="eq-location">
            Location:
          </label>
          <input
            id="eq-location"
            className="col-2"
            type="text"
            value={headerData.location}
            onChange={(e) => handleHeaderChange('location', e.target.value)}
          />
        </div>
        <div className="row my-2">
          <label className="col-2" htmlFor="county">
            County:
          </label>
          <input
            id="county"
            className="col-2"
            type="text"
            value={headerData.county}
            onChange={(e) => handleHeaderChange('county', e.target.value)}
          />
        </div>
        <div className="row my-2">
          <label className="col-2" htmlFor="state">
            State:
          </label>
          <input
            id="state"
            className="col-2"
            type="text"
            value={headerData.state}
            onChange={(e) => handleHeaderChange('state', e.target.value)}
          />
        </div>
      </>
    );
  };
  return <>{renderHeader()}</>;
};

export default DisplayHeader;
