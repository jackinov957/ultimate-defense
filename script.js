// Game Settings
const gridSize = 6; // 6x6 grid
const georgeMoveSpeed = 8000; // Move George across the grid in 8 seconds (half speed)
const georgeSpawnInterval = 2000; // Spawn George every 2 seconds
const bananaSpeed = 4000; // Speed of the banana (same speed as original George)
const zombieHealth = 3; // Each zombie has 3 health

// Get the game board element
const gameBoard = document.getElementById('game-board');

// Create the grid cells
for (let i = 0; i < gridSize * gridSize; i++) {
  const cell = document.createElement('div');
  cell.classList.add('grid-cell');
  gameBoard.appendChild(cell);
}

// Array to track active zombies and their health
const zombies = [];

// Function to spawn George (zombie) on a random lane
function spawnGeorge() {
  const lane = Math.floor(Math.random() * gridSize); // Pick a random row (0 to 5)
  const george = document.createElement('img');
  george.src = 'george.png'; // Your george image
  george.classList.add('george');

  // Each zombie starts with 3 health
  const zombie = { element: george, lane: lane, health: zombieHealth };
  zombies.push(zombie); // Add to the array of active zombies

  // Append George to the rightmost cell of the chosen lane
  const startCell = gameBoard.children[(lane * gridSize) + (gridSize - 1)]; // Rightmost cell in the random lane
  startCell.appendChild(george);

  // Move George from right to left across the entire row
  setTimeout(() => {
    george.style.transform = `translateX(-${gridSize * 100}px)`; // Move left across the row
  }, 100);

  // Remove George after 8 seconds when it has moved completely off the grid
  setTimeout(() => {
    if (george.parentElement) {
      george.remove();
      zombies.splice(zombies.indexOf(zombie), 1); // Remove from zombies array
    }
  }, georgeMoveSpeed + 100);
}

// Function for monkey to fire a banana at zombies in its lane
function fireBanana(lane) {
  const banana = document.createElement('img');
  banana.src = 'banana.png'; // Your banana image
  banana.classList.add('banana');

  // Append the banana to the leftmost cell of the lane
  const startCell = gameBoard.children[(lane * gridSize)]; // Leftmost cell in the lane
  startCell.appendChild(banana);

  // Move the banana to the right across the row
  setTimeout(() => {
    banana.style.transform = `translateX(${gridSize * 100}px)`; // Move banana right across the row
  }, 100);

  // Check if the banana hits any zombies in the same lane
  let bananaTravelTime = bananaSpeed;
  const bananaCheckInterval = setInterval(() => {
    // Check for collision with zombies in the same lane
    for (let i = 0; i < zombies.length; i++) {
      if (zombies[i].lane === lane) {
        const zombieElement = zombies[i].element;

        // Calculate the distance between the banana and the zombie
        const bananaRect = banana.getBoundingClientRect();
        const zombieRect = zombieElement.getBoundingClientRect();

        if (bananaRect.right >= zombieRect.left) {
          // Hit detected!
          zombies[i].health -= 1; // Decrease zombie health
          banana.remove(); // Remove the banana on hit
          clearInterval(bananaCheckInterval); // Stop checking once hit

          // Check if zombie's health is 0
          if (zombies[i].health <= 0) {
            zombieElement.remove(); // Remove the zombie
            zombies.splice(i, 1); // Remove from zombies array
          }
          break;
        }
      }
    }

    // Stop checking after the banana travels off the screen
    bananaTravelTime -= 100;
    if (bananaTravelTime <= 0) {
      clearInterval(bananaCheckInterval);
      banana.remove(); // Remove banana if it misses
    }
  }, 100);
}

// Check if there are zombies in the same lane and have monkeys fire bananas
function checkForZombiesAndFire() {
  for (let i = 0; i < gameBoard.children.length; i++) {
    const cell = gameBoard.children[i];
    if (cell.querySelector('.monkey')) {
      const lane = Math.floor(i / gridSize); // Determine which lane the monkey is in
      const zombiesInLane = zombies.filter(z => z.lane === lane);
      if (zombiesInLane.length > 0) {
        fireBanana(lane); // Fire banana at zombies in the same lane
      }
    }
  }
}

// Run the check for zombies and fire bananas every second
setInterval(checkForZombiesAndFire, 1000);

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
