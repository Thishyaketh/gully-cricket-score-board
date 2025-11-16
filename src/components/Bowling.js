import React from 'react';
import Autosuggest from 'react-autosuggest';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Bowling = ({
  suggestions,
  onSuggestionsFetchRequested,
  inputProps,
  editBowlerName,
  currentRunStack,
  undoDelivery,
}) => {
  return (
    <div className='bowler-container'>
      <div className='bowler'>
        Bowler:
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={() => {}}
          getSuggestionValue={(suggestion) => suggestion.name}
          renderSuggestion={(suggestion) => <div>{suggestion.name}</div>}
          inputProps={inputProps}
        />
        <IconButton color='primary' className='icon-button' onClick={editBowlerName}>
          <EditIcon className='icon-size' />
        </IconButton>
      </div>
      <div className='bowler-runs'>
        {currentRunStack.map((run, i) => (
          <div key={i}>{run}</div>
        ))}
        <IconButton color='warning' className='icon-button' onClick={undoDelivery}>
          <DeleteIcon className='delete-icon-size' />
        </IconButton>
      </div>
    </div>
  );
};

export default Bowling;
