import './Scoreboard.css'

function Scoreboard({ scores }) {
    const n = scores[0].length;
    return (
        <div className="scoresContainer">
            {scores.map((tallies, colIdx) => (
                <div className="scoresColumn" key={colIdx}>
                    {Array.from({length: n}, (_, rowIdx) => (
                        <div key={rowIdx}>{tallies[rowIdx]}</div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default Scoreboard
