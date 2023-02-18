import React from 'react';

export default function TableHead() {
  return (
    <thead className="thead-dark">
      <tr>
        <th rowSpan={2} className="text-center align-middle p-0">
          Run No.
        </th>
        <th className="text-center p-0" colSpan={2}>
          START
        </th>
        <th className="text-center p-0" colSpan={2}>
          FINISH
        </th>

        <th rowSpan={2} className="text-center align-middle p-0">
          LOG SPEED
        </th>
        <th rowSpan={2} className="text-center align-middle p-0">
          PEAK DEPTH
        </th>
        <th rowSpan={2} className="text-center align-middle p-0">
          REMARKS
        </th>
      </tr>
      <tr>
        <th className="text-center p-0">DEPTH</th>
        <th className="text-center p-0">TIME</th>
        <th className="text-center p-0">DEPTH</th>
        <th className="text-center p-0">TIME</th>
      </tr>
    </thead>
  );
}
