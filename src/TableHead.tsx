import React from 'react';

export default function TableHead() {
  return (
    <thead className="thead-dark">
      <tr>
        <th rowSpan={2} className="text-center align-middle p-0">
          ##
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
        <th className="text-center p-0">DEPTH START</th>
        <th className="text-center p-0">TIME START</th>
        <th className="text-center p-0">DEPTH FINISH</th>
        <th className="text-center p-0">TIME FINISH</th>
      </tr>
    </thead>
  );
}
