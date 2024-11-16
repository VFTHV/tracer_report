import React from 'react';

import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import TimeToDepth from './pages/TimeToDepth';

import TracerReport from './pages/TracerReport';
//  ideas
//  TimeToDepthProcessor line 75 - add min number of samples per station instead of just 50
//  TimeToDepthProcessor line 78 in if statement
//  calculate successful and ignored (due number of samples) stations
//  report these numbers after conversion
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
