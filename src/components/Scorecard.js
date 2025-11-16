import React from 'react';

const Scorecard = ({
  scoringTeam,
  totalRuns,
  wicketCount,
  totalOvers,
  crr,
  batting,
  team1,
  team2,
}) => {
  return (
    <div className='score'>
      <div>
        {scoringTeam} : {totalRuns}/{wicketCount} ({totalOvers})
      </div>
      <div>CRR : {isNaN(crr) ? 0 : crr}</div>
    </div>
  );
};

export default Scorecard;
