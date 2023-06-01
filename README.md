# Wireline Logging Radioactive Tracer Reporting tool and Time To Depth conversion tool

This is a 2-in-1 project: R/A trancer Reporting Tool that outputs report table in .xlsx format and Time-to-Depth tool that converts time driven noise log .las file to depth-driven .las file

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Overview

This project aims to simplify the creation of R/A tracer reporting table and .las file data conversion. It is built using React, Redux and TypeScript, and it focuses on precise output of depth and time data

## Features

### Radioactive Tracer

- Ability to change Louisiana and Texas reporting standards
- Ability to set total depth in order to determine the bottom logging interval
- Ability to add company logo to the table

### Time-to-Depth Conversion Tool

- Large multi-line time-driven .las file gets converted into much smaller depth driven .las file
- Data during the tool movement (LSPD curve !== 0) is removed from data
- 10% at the start and end of stationary data is removed
- Remaining 80% (from 10% to 90%) of stationary data is averaged out for each curve

## Installation

1. Clone the repository: `git clone https://github.com/VFTHV/tracer_report.git`
2. Navigate to the project directory: `cd tracer_report`
3. Install dependencies: `npm install`
4. Start the development server: `npm start`

## Usage

To use this project, follow these steps:

1. Open your web browser and go to [localhost:5173](http://localhost:3000) (or the appropriate URL if configured differently).
2. Current master branch is deployed at https://ra-tracer-report.netlify.app/

## Contributing

Contributions are welcome! If you'd like to contribute to the project, please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit them: `git commit -m "Add your commit message"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Create a new pull request explaining your changes.

## License

This project is licensed under the [MIT License](LICENSE). You are free to modify and distribute this code as per the terms of the license.
