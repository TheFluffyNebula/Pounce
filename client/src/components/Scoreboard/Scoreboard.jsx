import './Scoreboard.css'

function Scoreboard({ scores, playerId }) {
    console.log(playerId);
    const n = scores[0].length;
    return (
        <div className="scoresContainer">
            {scores.map((tallies, colIdx) => (
                <div
                    className={`scoresColumn ${colIdx === playerId ? 'playerColumn' : ''}`}
                    key={colIdx}
                >
                    {Array.from({ length: n }, (_, rowIdx) => (
                        <div key={rowIdx}>{tallies[rowIdx]}</div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default Scoreboard
