import React from 'react';

import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import TimeToDepth from './pages/TimeToDepth';

import TracerReport from './pages/TracerReport';

//  after file is read, get all sensors and let user choose offsets,
//  then convert with the curve depth shifted

export default function App() {
  return (
    <div className="container-fluid">
      <NavBar />
      <Routes>
        <Route path="/" element={<TracerReport />} />
        <Route path="/time-to-depth" element={<TimeToDepth />} />
      </Routes>
    </div>
  );
}
