import React, { useState, useEffect } from 'react';

import { HeaderInfo } from './logics/HeaderProcessor';

interface DisplayHeaderProps {
  header: HeaderInfo;
}

const DisplayHeader: React.FC<DisplayHeaderProps> = ({ header }) => {
  const [headerData, setHeaderData] = useState(header);

  useEffect(() => {
    setHeaderData(header);
  }, [header]);

  const handleHeaderChange = (field: keyof HeaderInfo, value: string) => {
    setHeaderData({ ...headerData, [field]: value });
  };

  const renderHeader = () => {
    return (
      <>
        <label>
          Date:
          <input
            type="text"
            value={headerData.date}
            onChange={(e) => handleHeaderChange('date', e.target.value)}
          />
        </label>
        <label>
          Company:
          <input
            type="text"
            value={headerData.company}
            onChange={(e) => handleHeaderChange('company', e.target.value)}
          />
        </label>
        <label>
          Well Name:
          <input
            type="text"
            value={headerData.wellName}
            onChange={(e) => handleHeaderChange('wellName', e.target.value)}
          />
        </label>
        <label>
          Plant Location:
          <input
            type="text"
            value={headerData.fieldName}
            onChange={(e) => handleHeaderChange('fieldName', e.target.value)}
          />
        </label>
        <label>
          Equipment Location:
          <input
            type="text"
            value={headerData.location}
            onChange={(e) => handleHeaderChange('location', e.target.value)}
          />
        </label>
        <label>
          County:
          <input
            type="text"
            value={headerData.countyName}
            onChange={(e) => handleHeaderChange('countyName', e.target.value)}
          />
        </label>
        <label>
          State:
          <input
            type="text"
            value={headerData.state}
            onChange={(e) => handleHeaderChange('state', e.target.value)}
          />
        </label>
      </>
    );
  };
  return <>{renderHeader()}</>;
};

export default DisplayHeader;
