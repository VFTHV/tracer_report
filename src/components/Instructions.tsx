import React from 'react';

export default function Instructions() {
  return (
    <div className="col-12 col-sm-6 col-lg-3 my-2">
      <a
        className="text-dark"
        href={`${process.env.PUBLIC_URL}/How_to_create_las_for_RAT_report.pdf`}
        download
      >
        How to create multiple-pass .las
      </a>
    </div>
  );
}
