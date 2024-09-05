// Game Settings
const gridSize = 6; // 6x6 grid
const georgeMoveSpeed = 12000; // Move George across the grid in 12 seconds (slower speed)
const georgeSpawnInterval = 2000; // Spawn George every 2 seconds
const bananaSpeed = 6000; // Speed of the banana (should be fast enough to reach zombies)
const zombieHealth = 3; // Each zombie has 3 health
const dollarSpawnInterval = 3000; // Dollar falls from the sky every 3 seconds
const towerEatenDuration = 3000; // Time before tower disappears after being eaten

let playerMoney = 0; // Player's money

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

  // Move George from right to left across the entire row (slower speed)
  setTimeout(() => {
    george.style.transform = `translateX(-${gridSize * 100}px)`; // Move left across the row
  }, 100);

  // Remove George after 12 seconds when it has moved completely off the grid
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
            zombies.splice(zombies.indexOf(zombie), 1); // Remove from zombies array
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

// Function to spawn a dollar from the sky
function spawnDollar() {
  const dollar = document.createElement('img');
  dollar.src = 'dollar.png'; // Your dollar image
  dollar.classList.add('dollar');

  // Random starting position at the top of the grid
  const startX = Math.floor(Math.random() * gridSize) * 100;
  dollar.style.left = `${startX}px`;
  dollar.style.top = '0px';
  gameBoard.appendChild(dollar);

  // Animate the dollar falling down
  const fallDuration = 3000;
  dollar.style.transition = `top ${fallDuration}ms linear`;
  setTimeout(() => {
    dollar.style.top = `${gridSize * 100}px`; // Move the dollar to the bottom of the grid
  }, 100);

  // Remove the dollar after falling down
  setTimeout(() => {
    dollar.remove();
  }, fallDuration + 100);

  // Handle dollar click event
  dollar.addEventListener('click', () => {
    playerMoney += 50;
    alert(`You collected $50! Total money: $${playerMoney}`);
    dollar.remove(); // Remove dollar on click
  });
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

// Function to spawn a dollar on top of a dog tower every second
function spawnDollarOnDog(dog) {
  setInterval(() => {
    const dollar = document.createElement('img');
    dollar.src = 'dollar.png'; // Your dollar image
    dollar.classList.add('dollar');
    dollar.style.left = `${dog.offsetLeft}px`;
    dollar.style.top = `${dog.offsetTop}px`;
    gameBoard.appendChild(dollar);

    // Handle dollar click event
    dollar.addEventListener('click', () => {
      playerMoney += 50;
      alert(`You collected $50! Total money: $${playerMoney}`);
      dollar.remove(); // Remove dollar on click
    });

    // Remove dollar after 3 seconds
    setTimeout(() => {
      dollar.remove();
    }, 3000);
  }, 1000);
}

// Function to place a dog tower
function placeDog(event) {
  if (placingTower && event.target.classList.contains('grid-cell') && !event.target.querySelector('.dog') && !event.target.querySelector('.monkey')) {
    const cell = event.target;
    const dog = document.createElement('img');
    dog.src = 'dog.png'; // Your dog image
    dog.classList.add('dog');
    cell.appendChild(dog);

    // Start spawning dollars on the dog tower
    spawnDollarOnDog(dog);

    placingTower = false; // Disable tower placement mode
  }
}

// Function to handle zombies eating towers
function handleZombiesEatingTowers() {
  zombies.forEach(zombie => {
    const zombieRect = zombie.element.getBoundingClientRect();
    for (let i = 0; i < gameBoard.children.length; i++) {
      const cell = gameBoard.children[i];
      if (cell.querySelector('.monkey') || cell.querySelector('.dog')) {
        const tower =

