import React from 'react';
import CameraFeed from './CameraFeed';
import Scorecard from './Scorecard';
import Batting from './Batting';
import Bowling from './Bowling';
import './VideoScorecard.css';

const VideoScorecard = (props) => {
  return (
    <div className="video-scorecard-container">
      <CameraFeed />
      <div className="scorecard-overlay">
        <Scorecard
          scoringTeam={props.scoringTeam}
          totalRuns={props.totalRuns}
          wicketCount={props.wicketCount}
          totalOvers={props.totalOvers}
          crr={props.crr}
        />
        <Batting
          strikeValue={props.strikeValue}
          handleStrikeChange={props.handleStrikeChange}
          batter1={props.batter1}
          batter2={props.batter2}
          editBatter1Name={props.editBatter1Name}
          editBatter2Name={props.editBatter2Name}
        />
        <Bowling
          suggestions={props.suggestions}
          onSuggestionsFetchRequested={props.onSuggestionsFetchRequested}
          inputProps={props.inputProps}
          editBowlerName={props.editBowlerName}
          currentRunStack={props.currentRunStack}
          undoDelivery={props.undoDelivery}
        />
      </div>
    </div>
  );
};

export default VideoScorecard;
