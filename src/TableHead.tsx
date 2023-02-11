import React from 'react';

export default function TableHead() {
  return (
    <>
      <tr>
        <th rowSpan={2} className="text-center align-middle">
          ##
        </th>
        <th className="text-center" colSpan={2}>
          START
        </th>
        <th className="text-center" colSpan={2}>
          FINISH
        </th>

        <th rowSpan={2} className="text-center align-middle">
          LOG SPEED
        </th>
        <th rowSpan={2} className="text-center align-middle">
          PEAK DEPTH
        </th>
      </tr>
      <tr>
        <th className="text-center">DEPTH START</th>
        <th className="text-center">TIME START</th>
        <th className="text-center">DEPTH FINISH</th>
        <th className="text-center">TIME FINISH</th>
      </tr>
    </>
  );
}
