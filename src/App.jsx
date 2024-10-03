import React, { useRef, useState } from 'react';
import './App.css';


function generateSudokuGrid() {
  const grid = Array.from({ length: 27 }, () => Array(27).fill(0)); // Create an empty 27x27 grid

  // Iterate over the 9x9 blocks
  for (let blockRow = 0; blockRow < 9; blockRow++) {
    for (let blockCol = 0; blockCol < 9; blockCol++) {
      // Inside each 9x9 block, iterate over the 3x3 grids
      for (let smallRow = 0; smallRow < 3; smallRow++) {
        for (let smallCol = 0; smallCol < 3; smallCol++) {
          const rowIndex = blockRow * 3 + smallRow; // Calculate the row index in the 27x27 grid
          const colIndex = blockCol * 3 + smallCol; // Calculate the column index in the 27x27 grid

          // Calculate the number for the grid based on smallRow (1st, 2nd, 3rd row cycle)
          const baseNumber = smallRow * 3 + 1;
          grid[rowIndex][colIndex] = baseNumber + (smallCol % 3); // Create the 123, 456, 789 patterns
        }
      }
    }
  }

  return grid;
}

const SmallSudokuGrid = ({ row, col, numbers, handleCellClick }) => {
  return (
    <div className="small-sudoku-grid">
      {Array(9).fill(0).map((_, index) => {
        const number = index + 1; // Placeholder for actual Sudoku numbers
        const smallRow = Math.floor(index / 3) + 1; // Rows (1-3)
        const smallCol = (index % 3) + 1; // Columns (1-3)

        return (
          <div
            key={index}
            className={`small-grid-cell row-${row + 1} column-${col + 1} small-row-${smallRow} small-column-${smallCol}`}
            onClick={() => handleCellClick(number, row + 1, col + 1)} // Pass the clicked number and position
          >
            {numbers[index]} {/* Render the number from state */}
          </div>
        );
      })}
    </div>
  );
};

const SudokuGrid = () => {
  // const [numbers, setNumbers] = useState(Array(81).fill(0).map((_, index) => (index % 9) + 1)); // Initial numbers from 1-9

  // const handleCellClick = (number, row, col) => {
  //   // Create a copy of current numbers
  //   const newNumbers = [...numbers];
  //   console.log(...numbers);

  //   // Loop through the entire grid to remove the number from the specified row and column
  //   for (let i = 0; i < 9; i++) {
  //     // Remove from the specified row
  //     const rowStart = (row - 1) * 9; // Starting index for the row
  //     const rowIdx = rowStart + i; // Index in the flat array

  //     if (newNumbers[rowIdx] === number) {
  //       newNumbers[rowIdx] = ''; // Remove the number from the row
  //     }

  //     // Remove from the specified column
  //     const colIdx = (i * 9) + (col - 1); // Correctly calculate the column index

  //     if (newNumbers[colIdx] === number) {
  //       newNumbers[colIdx] = ''; // Remove the number from the column
  //     }
  //   }

  //   setNumbers(newNumbers); // Update state with new numbers // Update state with new numbers
  // };

  // return (
  //   <div className="sudoku-grid">
  //     {Array(9).fill(0).map((_, rowIndex) => (
  //       Array(9).fill(0).map((_, colIndex) => (
  //         <div key={`${rowIndex}-${colIndex}`} className="grid-cell">
  //           <SmallSudokuGrid 
  //             row={rowIndex} 
  //             col={colIndex} 
  //             numbers={numbers.slice(rowIndex * 9, (rowIndex + 1) * 9)} // Pass the relevant part of numbers
  //             handleCellClick={handleCellClick} // Pass the click handler
  //           />
  //         </div>
  //       ))
  //     ))}
  //   </div>
  // );
  const [grid, setGrid] = useState(generateSudokuGrid());
  const cellRefs = useRef(Array.from({ length: 27 }, () => Array(27).fill(null)));

  // Function to handle click events on each cell
  const handleClick = (rowIndex, colIndex) => {
    const clickedNumber = grid[rowIndex][colIndex];
    console.log(`Clicked cell at Row: ${rowIndex}, Column: ${colIndex} with number ${clickedNumber}`);
    var row_in_3 = Math.floor(rowIndex / 9)
    var col_in_3 = Math.floor(colIndex / 9)
    var row_in_9 = Math.floor(rowIndex / 3)
    var col_in_9 = Math.floor(colIndex / 3)
    console.log({ row_in_9, col_in_9 });
    // Update the grid where all 'clickedNumber' in the first 3 rows and 3 columns are set to 0
    const newGrid = [...grid].map(row => [...row]); // Deep copy of the grid

    for (let i = 0; i < 27; i++) {
      for (let j = 0; j < 27; j++) {
        // Set the number to 0 if it matches the clicked number in the 3x3 region
        if (newGrid[i][colIndex] === clickedNumber) newGrid[i][colIndex] = 0; // Columns in first 3 rows
        if (newGrid[rowIndex][j] === clickedNumber) newGrid[rowIndex][j] = 0; // Rows in first 3 columns
        if (row_in_9 == Math.floor(i / 3) && col_in_9 == Math.floor(j / 3)) {
          newGrid[i][j] = 0;
        }
        if (row_in_3 == Math.floor(i / 9) && col_in_3 == Math.floor(j / 9) && newGrid[i][j] == clickedNumber) {
          newGrid[i][j] = 0;
        }


      }
    }
    newGrid[row_in_9 * 3 + 1][col_in_9 * 3 + 1] = clickedNumber * 10

    setGrid(newGrid);
  };

  return (
    <div className="sudoku-grid">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="sudoku-row">
          {row.map((cellValue, colIndex) => (
            cellValue === 0 ? (
              <div key={colIndex} className={`sudoku-cell empty-cell  ${rowIndex === 0 ? 'bg-top' : ''} 
          ${colIndex === 0 ? 'bg-left' : ''} ${rowIndex % 3 === 2 ? 'bg-3_bottom' : ''} ${colIndex % 3 === 2 ? 'bg-3_right' : ''}  ${rowIndex % 9 === 8 ? 'bg-bottom' : ''} ${colIndex % 9 === 8 ? 'bg-right' : ''} `}>
                {' '} {/* Empty space for 0 */}
              </div>
            ) : cellValue >= 10 ? (
              <div
                key={colIndex}
                className=" clicked"
              >
                {cellValue / 10}
              </div>
            ) : (
              <div
                key={colIndex}
                className={`sudoku-cell  ${rowIndex === 0 ? 'bg-top' : ''} 
          ${colIndex === 0 ? 'bg-left' : ''}  ${rowIndex % 3 === 2 ? 'bg-3_bottom' : ''} ${colIndex % 3 === 2 ? 'bg-3_right' : ''} ${rowIndex % 9 === 8 ? 'bg-bottom' : ''} ${colIndex % 9 === 8 ? 'bg-right' : ''} `}
                onClick={() => handleClick(rowIndex, colIndex)} // OnClick handler
              >
                {cellValue}
              </div>
            )
          ))}

        </div>
      ))}
    </div>

  );
};



function App() {
  return (
    <div className="App">
      <SudokuGrid />
    </div>
  );
}

export default App;
