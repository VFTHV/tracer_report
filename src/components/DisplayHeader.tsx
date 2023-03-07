import React, { useState, useEffect } from 'react';

import { HeaderInfo } from '../logics/HeaderProcessor';

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
      <div className="row">
        <div className="col col-md-10 col-xl-8">
          <table className="table table-striped table-bordered w-50">
            <tbody>
              <tr>
                <th scope="row" className="text-nowrap py-0">
                  Date:
                </th>
                <td className="p-0">
                  <input
                    className="col p-0 border-0 text-center bg-transparent"
                    type="text"
                    value={headerData.date}
                    onChange={(e) => handleHeaderChange('date', e.target.value)}
                  />
                </td>
              </tr>

              <tr>
                <th scope="row" className="text-nowrap py-0">
                  Company:
                </th>
                <td className="p-0">
                  <input
                    className="col p-0 border-0 text-center bg-transparent"
                    type="text"
                    value={headerData.company}
                    onChange={(e) =>
                      handleHeaderChange('company', e.target.value)
                    }
                  />
                </td>
              </tr>

              <tr>
                <th scope="row" className="text-nowrap py-0">
                  Well Name:
                </th>
                <td className="p-0">
                  <input
                    className="col p-0 border-0 text-center bg-transparent"
                    type="text"
                    value={headerData.well}
                    onChange={(e) => handleHeaderChange('well', e.target.value)}
                  />
                </td>
              </tr>

              <tr>
                <th scope="row" className="text-nowrap py-0">
                  Plant/Field:
                </th>
                <td className="p-0">
                  <input
                    className="col p-0 border-0 text-center bg-transparent"
                    type="text"
                    value={headerData.field}
                    onChange={(e) =>
                      handleHeaderChange('field', e.target.value)
                    }
                  />
                </td>
              </tr>

              <tr>
                <th scope="row" className="text-nowrap py-0">
                  Location:
                </th>
                <td className="p-0">
                  <input
                    className="col p-0 border-0 text-center bg-transparent"
                    type="text"
                    value={headerData.location}
                    onChange={(e) =>
                      handleHeaderChange('location', e.target.value)
                    }
                  />
                </td>
              </tr>

              <tr>
                <th scope="row" className="text-nowrap py-0">
                  County:
                </th>
                <td className="p-0">
                  <input
                    className="col p-0 border-0 text-center bg-transparent"
                    type="text"
                    value={headerData.county}
                    onChange={(e) =>
                      handleHeaderChange('county', e.target.value)
                    }
                  />
                </td>
              </tr>

              <tr>
                <th scope="row" className="text-nowrap py-0">
                  State:
                </th>
                <td className="p-0">
                  <input
                    className="col p-0 border-0 text-center bg-transparent"
                    type="text"
                    value={headerData.state}
                    onChange={(e) =>
                      handleHeaderChange('state', e.target.value)
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  return <>{renderHeader()}</>;
};

export default DisplayHeader;
