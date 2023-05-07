import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setHeader, StoreState } from '../store';
import { Standards } from '../logics/Standards';

import { HeaderInfo } from '../logics/HeaderProcessor';

const DisplayHeader: FC = () => {
  const dispatch = useDispatch();
  const { header, standard } = useSelector((state: StoreState) => state.tracer);

  const handleHeaderChange = (field: keyof HeaderInfo, value: string) => {
    const newHeader = { ...header, [field]: value };
    dispatch(setHeader(newHeader));
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
                    value={header.date}
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
                    value={header.company}
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
                    value={header.well}
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
                    value={header.field}
                    onChange={(e) =>
                      handleHeaderChange('field', e.target.value)
                    }
                  />
                </td>
              </tr>

              <tr>
                <th scope="row" className="text-nowrap py-0">
                  District:
                </th>
                <td className="p-0">
                  <input
                    className="col p-0 border-0 text-center bg-transparent"
                    type="text"
                    value={header.district}
                    onChange={(e) =>
                      handleHeaderChange('district', e.target.value)
                    }
                  />
                </td>
              </tr>

              <tr>
                <th scope="row" className="text-nowrap py-0">
                  {standard === Standards.Texas ? 'County' : 'Parish'}
                </th>
                <td className="p-0">
                  <input
                    className="col p-0 border-0 text-center bg-transparent"
                    type="text"
                    value={
                      standard === Standards.Texas
                        ? header.county
                        : header.parish
                    }
                    onChange={(e) =>
                      handleHeaderChange(
                        standard === Standards.Texas ? 'county' : 'parish',
                        e.target.value
                      )
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
                    value={header.state}
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
