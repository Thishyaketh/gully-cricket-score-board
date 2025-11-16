import React from 'react';
import { Radio, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const Batting = ({
  strikeValue,
  handleStrikeChange,
  batter1,
  batter2,
  handleBatter1Blur,
  handleBatter2Blur,
  editBatter1Name,
  editBatter2Name,
}) => {
  return (
    <div className='batting-container'>
      <table>
        <thead>
          <tr>
            <td className='score-types padding-left'>Batting</td>
            <td className='score-types'>R(B)</td>
            <td className='score-types text-center'>4s</td>
            <td className='score-types text-center'>6s</td>
            <td className='score-types text-center'>SR</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className='score-types'>
              <span id='strike'>
                <Radio
                  size='small'
                  checked={strikeValue === 'strike'}
                  onChange={handleStrikeChange}
                  value='strike'
                  name='radio-buttons'
                  inputProps={{ 'aria-label': 'strike' }}
                  style={{ padding: '0 4px 0 2px' }}
                />
              </span>
              <input type='text' id='batter1Name' className='batter-name' onBlur={handleBatter1Blur} />
              <IconButton color='primary' className='icon-button' onClick={editBatter1Name}>
                <EditIcon className='icon-size' />
              </IconButton>
            </td>
            <td className='score-types'>{batter1.run === undefined ? `0(0)` : `${batter1.run}(${batter1.ball})`}</td>
            <td className='score-types'>{batter1.four === undefined ? 0 : batter1.four}</td>
            <td className='score-types'>{batter1.six === undefined ? 0 : batter1.six}</td>
            <td className='score-types'>{batter1.strikeRate === undefined ? 0 : batter1.strikeRate}</td>
          </tr>
          <tr>
            <td className='score-types'>
              <span id='non-strike'>
                <Radio
                  size='small'
                  checked={strikeValue === 'non-strike'}
                  onChange={handleStrikeChange}
                  value='non-strike'
                  name='radio-buttons'
                  inputProps={{ 'aria-label': 'non-strike' }}
                  style={{ padding: '0 4px 0 2px' }}
                />
              </span>
              <input type='text' id='batter2Name' className='batter-name' onBlur={handleBatter2Blur} />
              <IconButton color='primary' className='icon-button' onClick={editBatter2Name}>
                <EditIcon className='icon-size' />
              </IconButton>
            </td>
            <td className='score-types'>{batter2.run === undefined ? `0(0)` : `${batter2.run}(${batter2.ball})`}</td>
            <td className='score-types'>{batter2.four === undefined ? 0 : batter2.four}</td>
            <td className='score-types'>{batter2.six === undefined ? 0 : batter2.six}</td>
            <td className='score-types'>{batter2.strikeRate === undefined ? 0 : batter2.strikeRate}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Batting;
