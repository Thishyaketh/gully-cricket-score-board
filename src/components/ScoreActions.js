import React from 'react';

const ScoreActions = ({ handleRun, handleNoBall, handleWide, setModalOpen }) => {
  return (
    <div className='score-types-container'>
      <table>
        <tbody>
          <tr>
            <td className='score-types' onClick={() => handleRun(0)}>
              <button className='score-types-button' disabled>
                0
              </button>
            </td>
            <td className='score-types' onClick={() => handleRun(1)}>
              <button className='score-types-button' disabled>
                1
              </button>
            </td>
            <td className='score-types' onClick={() => handleRun(2)}>
              <button className='score-types-button' disabled>
                2
              </button>
            </td>
            <td className='score-types' onClick={handleNoBall}>
              <button className='score-types-button' disabled>
                nb
              </button>
            </td>
            <td rowSpan='2' className='score-types' onClick={() => setModalOpen(true)}>
              <button className='score-types-button' disabled>
                W
              </button>
            </td>
          </tr>
          <tr>
            <td className='score-types' onClick={() => handleRun(3)}>
              <button className='score-types-button' disabled>
                3
              </button>
            </td>
            <td className='score-types' onClick={() => handleRun(4)}>
              <button className='score-types-button' disabled>
                4
              </button>
            </td>
            <td className='score-types' onClick={() => handleRun(6)}>
              <button className='score-types-button' disabled>
                6
              </button>
            </td>
            <td className='score-types' onClick={handleWide}>
              <button className='score-types-button' disabled>
                wd
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ScoreActions;
