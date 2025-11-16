import React from 'react';
import { useHistory } from 'react-router-dom';
import './MatchFormatSelection.css';

const MatchFormatSelection = () => {
  const history = useHistory();

  const handleFormatSelection = (format) => {
    localStorage.setItem('matchFormat', format);
    history.push('/setup');
  };

  return (
    <div className="match-format-selection-container">
      <div className="card">
        <h1 className="card-title">Choose Match Format</h1>
        <div className="card-actions">
          <button className="btn" onClick={() => handleFormatSelection('T20')}>
            T20
          </button>
          <button className="btn" onClick={() => handleFormatSelection('ODI')}>
            ODI
          </button>
          <button className="btn" onClick={() => handleFormatSelection('Test')}>
            Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchFormatSelection;
