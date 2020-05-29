import React, { useState, useEffect } from "react";
import "./App.css";

// VARIOUS DEFAULT STATES

const gilders = [
  // occilator
  [0, 1],
  [1, 1],
  [2, 1],
  // Glider
  [3, 4],
  [4, 5],
  [5, 5],
  [5, 4],
  [5, 3]
];

const gun = [
  [2, 25],
  [3, 25],
  [3, 23],
  [4, 35],
  [4, 36],
  [4, 13],
  [4, 14],
  [4, 21],
  [4, 22],
  [5, 35],
  [5, 36],
  [5, 21],
  [5, 22],
  [6, 1],
  [6, 2],
  [5, 12],
  [5, 16],
  [7, 1],
  [7, 2],
  [6, 21],
  [6, 22],
  [6, 17],
  [6, 11],
  [7, 11],
  [7, 17],
  [7, 18],
  [7, 15],
  [7, 23],
  [8, 11],
  [8, 17],
  [7, 25],
  [8, 25],
  [9, 12],
  [9, 16],
  [10, 13],
  [10, 14]
];

const setupGrid = seed => {
  const newGrid = initialCells();
  seed.forEach(coord => {
    const [r, c] = coord;
    newGrid[r][c] = 1;
  });
  return newGrid;
};

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
  const [cellState, setCellState] = useState(setupGrid(gun));
  const [loop, setLoopState] = useState(false);

  useEffect(() => {
    if (loop) {
      const timer = setTimeout(() => {
        setCellState(step(cellState));
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [cellState, loop]);
  return (
    <div className="App">
      <header className="App-header">Paul's game of life</header>
      <main className="main">
        <div className="btns">
          <h4>Controls</h4>
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
          <h5>Scroll to the bottom to load some presets</h5>
        </div>
        <div class="border">
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
        </div>
        <div className="btns">
          <h4>Presets</h4>
          <button
            onClick={() => {
              setCellState(setupGrid(gilders));
            }}
          >
            A Glider and an occilator
          </button>
          <button
            onClick={() => {
              setCellState(setupGrid(gun));
            }}
          >
            A Glider gun (seriously cool)
          </button>
          <button
            onClick={() => {
              const randomNoise = Array.from(new Array(50), () =>
                Array.from(new Array(50), () =>
                  Math.floor(Math.random() * Math.floor(2))
                )
              );
              setCellState(randomNoise);
            }}
          >
            Random stuff
          </button>
        </div>
      </main>
      <footer className="App-header">
        <p>
          Made by{" "}
          <a
            className="App-link"
            href="https://phalt.github.io"
            rel="noopener noreferrer"
            target="_blank"
          >
            Paul Hallett
          </a>{" "}
          just for fun ya know.
        </p>
      </footer>
    </div>
  );
}

export default App;
