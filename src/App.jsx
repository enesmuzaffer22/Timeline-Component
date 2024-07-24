import React, { useState } from 'react';
import Timeline from './components/Timeline';
import ButtonInfoTable from './components/ButtonInfoTable';
import './style/main.scss';

function App() {
  const [buttonInfo, setButtonInfo] = useState(null);

  const handleButtonSelect = (info) => {
    setButtonInfo(info);
  };

  return (
    <div className="app-container">
      <div className="timeline-and-info">
        <ButtonInfoTable buttonInfo={buttonInfo} />
        <Timeline onButtonSelect={handleButtonSelect} />
      </div>
    </div>
  );
}

export default App;
