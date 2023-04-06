import React from 'react';

import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import TimeToDepth from './pages/TimeToDepth';

import TracerReport from './pages/TracerReport';
import CurveSpike from './pages/CurveSpike';

export default function App() {
  return (
    <div className="container-fluid">
      <NavBar />
      <Routes>
        <Route path="/" element={<TracerReport />} />
        <Route path="/time-to-depth" element={<TimeToDepth />} />
        <Route path="/curve-spike" element={<CurveSpike />} />
      </Routes>
    </div>
  );
}
