import React, { useState } from 'react';

import FileProcessor from './FileProcessor';
import DisplayData from './DisplayData';
import { PassInfo } from './logics/DataProcessor';
import { HeaderInfo } from './logics/HeaderProcessor';

const App = () => {
  const [passData, setPassData] = useState<PassInfo[]>([]);
  const [header, setHeader] = useState<HeaderInfo>({} as HeaderInfo);

  return (
    <div>
      <FileProcessor setPassData={setPassData} setHeader={setHeader} />
      <DisplayData passData={passData} header={header} />
    </div>
  );
};

export default App;
