import React, { useState, useEffect } from "react";
import "./App.css";

const range = count => Array.from(new Array(count), (x, i) => 0);
// 50 x 50 grid
const initialCells = () =>
  Array.from(new Array(50), () => Array.from(new Array(50), () => 0));

const between = (x, min, max) => x >= min && x <= max;

const process = (cells, cellRow, cellColumn) => {
  let aliveCount = 0;
  const isAlive = cells[cellRow][cellColumn];
  const coords = [
    [cellRow - 1, cellColumn - 1],
    [cellRow - 1, cellColumn],
    [cellRow - 1, cellColumn + 1],
    [cellRow, cellColumn - 1],
    [cellRow, cellColumn + 1],
    [cellRow + 1, cellColumn - 1],
    [cellRow + 1, cellColumn],
    [cellRow + 1, cellColumn + 1]
  ];
  coords.forEach(coord => {
    const [row, column] = coord;
    if (between(row, 0, 49) && between(column, 0, 49)) {
      aliveCount += cells[row][column];
    }
  });
  if (!isAlive && aliveCount === 3) {
    // cell becomes alive
    return 1;
  }
  if (isAlive && between(aliveCount, 2, 3)) {
    // Stays alive
    return 1;
  }
  // Otherwise dies
  return 0;
};

const step = cells => {
  const newState = initialCells();
  newState.forEach((_, r) => {
    _.forEach((_, c) => {
      newState[r][c] = process(cells, r, c);
    });
  });
  return newState;
};

function App() {
  const [cellState, setCellState] = useState(initialCells());
  const [loop, setLoopState] = useState(false);

  useEffect(() => {
    if (loop) {
      const timer = setTimeout(() => {
        setCellState(step(cellState));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [cellState, loop]);
  return (
    <div className="App">
      <header className="App-header">Paul's game of life</header>
      <main className="main">
        <div className="btns">
          <button
            onClick={() => {
              const res = step(cellState);
              setCellState(res);
            }}
          >
            step
          </button>
          <button
            onClick={() => {
              setLoopState(!loop);
            }}
          >
            {!loop ? "loop" : "stop"}
          </button>
          <button
            onClick={() => {
              setCellState(initialCells());
            }}
          >
            reset
          </button>
        </div>
        {range(50).map((_, rowIndex) => {
          return (
            <div className="row">
              {range(50).map((_, columnIndex) => {
                const isAlive = cellState[rowIndex][columnIndex] === 1;
                return (
                  <div
                    onClick={() => {
                      cellState[rowIndex][columnIndex] = isAlive ? 0 : 1;
                      setCellState(cellState.slice());
                    }}
                    className={`column ${isAlive ? "alive" : "dead"}`}
                  >
                    &nbsp;
                  </div>
                );
              })}
            </div>
          );
        })}
      </main>
    </div>
  );
}

export default App;
