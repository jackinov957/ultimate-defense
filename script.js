// Game Settings
const gridSize = 6; // 6x6 grid
const georgeMoveSpeed = 1000; // 2 cells per second (1000ms per cell)
const georgeSpawnInterval = 2000; // Spawn George every 2 seconds

// Get the game board element
const gameBoard = document.getElementById('game-board');

// Create the grid cells
for (let i = 0; i < gridSize * gridSize; i++) {
  const cell = document.createElement('div');
  cell.classList.add('grid-cell');
  gameBoard.appendChild(cell);
}

// Add the monkey to a specific cell (e.g., top-left corner for now)
const cells = document.querySelectorAll('.grid-cell');
const monkey = document.createElement('img');
monkey.src = 'monkey.png'; // Your monkey image
monkey.classList.add('monkey');
cells[0].appendChild(monkey); // Place it in the first cell

// Function to spawn George on a random lane
function spawnGeorge() {
  const lane = Math.floor(Math.random() * gridSize); // Pick a random row (0 to 5)
  const george = document.createElement('img');
  george.src = 'george.png'; // Your george image
  george.classList.add('george');

  // Append George to the rightmost cell of the chosen lane
  const startCell = cells[(lane * gridSize) + (gridSize - 1)];
  startCell.appendChild(george);

  // Move George left across the lane
  let position = gridSize - 1;
  const moveGeorge = setInterval(() => {
    if (position > 0) {
      position--;
      const newCell = cells[(lane * gridSize) + position];
      newCell.appendChild(george); // Move George to the next cell
    } else {
      clearInterval(moveGeorge); // Stop moving when George reaches the end of the lane
      george.remove(); // Remove George from the board
    }
  }, georgeMoveSpeed);
}

// Spawn George every 2 seconds
setInterval(spawnGeorge, georgeSpawnInterval);
