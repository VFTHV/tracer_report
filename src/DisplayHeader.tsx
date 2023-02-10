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
            value={headerData.well}
            onChange={(e) => handleHeaderChange('well', e.target.value)}
          />
        </label>
        <label>
          Plant Location:
          <input
            type="text"
            value={headerData.field}
            onChange={(e) => handleHeaderChange('field', e.target.value)}
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
            value={headerData.county}
            onChange={(e) => handleHeaderChange('county', e.target.value)}
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
