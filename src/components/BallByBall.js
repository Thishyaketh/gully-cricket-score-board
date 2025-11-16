import React from 'react';

const BallByBall = ({ recentOvers }) => {
  return (
    <div className="ball-by-ball-container">
      <h3>Ball-by-Ball</h3>
      <div className="feed">
        {recentOvers.map((over, i) => (
          <div key={i} className="over">
            <strong>Over {over.overNo}</strong>
            {over.stack.map((ball, j) => (
              <div key={j} className="ball">
                {ball}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BallByBall;
