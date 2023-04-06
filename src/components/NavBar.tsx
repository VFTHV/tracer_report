import React from 'react';
import { NavLink } from 'react-router-dom';

export default function NavBar() {
  return (
    <header className="navbar navbar-expand navbar-light bg-light">
      <nav>
        <ul className="navbar-nav">
          <li className="nav-item">
            <NavLink
              to="/"
              className={({ isActive }) =>
                (isActive ? 'active' : '') + ' nav-link'
              }
            >
              Tracer Report
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/time-to-depth"
              className={({ isActive }) =>
                (isActive ? 'active' : '') + ' nav-link'
              }
            >
              Time To Depth
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/curve-spike"
              className={({ isActive }) =>
                (isActive ? 'active' : '') + ' nav-link'
              }
            >
              Curve Spike
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
