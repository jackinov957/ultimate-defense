// Game Settings
const gridSize = 6; // 6x6 grid
const georgeMoveSpeed = 4000; // Move George across the grid in 4 seconds
const georgeSpawnInterval = 2000; // Spawn George every 2 seconds

// Get the game board element
const gameBoard = document.getElementById('game-board');

// Create the grid cells
for (let i = 0; i < gridSize * gridSize; i++) {
  const cell = document.createElement('div');
  cell.classList.add('grid-cell');
  gameBoard.appendChild(cell);
}

// Function to spawn George on a random lane
function spawnGeorge() {
  const lane = Math.floor(Math.random() * gridSize); // Pick a random row (0 to 5)
  const george = document.createElement('img');
  george.src = 'george.png'; // Your george image
  george.classList.add('george');

  // Append George to the leftmost cell of the chosen lane
  const startCell = gameBoard.children[lane * gridSize]; // Leftmost cell in the random lane
  startCell.appendChild(george);

  // Move George across the lane (left to right)
  setTimeout(() => {
    george.style.transform = `translateX(${(gridSize - 1) * 100}px)`; // Move across the row
  }, 100); // Slight delay to apply smooth transition

  // Remove George after 4 seconds
  setTimeout(() => {
    george.remove();
  }, georgeMoveSpeed);
}

// Spawn George every 2 seconds
setInterval(spawnGeorge, georgeSpawnInterval);

// Add the monkey when the user clicks a cell after clicking the "Place Monkey" button
let placingMonkey = false;

document.getElementById('place-monkey-button').addEventListener('click', () => {
  placingMonkey = true; // Enable monkey placement mode
  alert('Click on a square to place a monkey!');
});

gameBoard.addEventListener('click', (event) => {
  if (placingMonkey && event.target.classList.contains('grid-cell')) {
    const cell = event.target;
    const monkey = document.createElement('img');
    monkey.src = 'monkey.png'; // Your monkey image
    monkey.classList.add('monkey');
    cell.appendChild(monkey); // Place the monkey in the clicked cell
    placingMonkey = false; // Disable monkey placement mode
  }
});
