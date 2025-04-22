// Game variables
const symbols = ['⚡','👩‍🎤','🎸','꩜','🚀','🛸','💽','👨‍🚀','🎵','🌈','🔮','👽'];
const tiles = symbols.concat(symbols); // double the symbols for matching
let firstTile = null;
let canClick = true;
let gameTimer;
let timeRemaining = 120;

// Play sound function with error handling
function playSound(soundId) {
  try {
    const sound = document.getElementById(soundId);
    if (sound) {
      sound.currentTime = 0; // Reset to start
      sound.play().catch(error => {
        console.error(`Error playing ${soundId}:`, error);
      });
    }
  } catch (error) {
    console.error(`Error accessing sound ${soundId}:`, error);
  }
}

// Shuffle array function using Fisher-Yates algorithm for better randomization
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Start the game
function startGame() {
  console.log("Starting game...");
  
  // Get DOM elements
  const gameBoard = document.getElementById('gameBoard');
  const timerContainer = document.getElementById('timerContainer');
  const timerText = document.getElementById('timerText');
  const instructionsBox = document.getElementById('instructionsBox');
  
  // Hide instructions
  instructionsBox.style.display = 'none';
  
  // Reset game elements
  document.getElementById('birthdayMessage').style.display = 'none';
  
  // Clear game board and show it
  gameBoard.innerHTML = '';
  gameBoard.style.display = 'flex';
  
  // Reset and show timer
  timeRemaining = 120;
  timerText.innerText = timeRemaining;
  timerContainer.style.display = 'flex';
  timerContainer.classList.remove('timer-warning');
  
  // Create game tiles
  const shuffledTiles = shuffleArray(tiles);
  shuffledTiles.forEach((symbol, index) => {
    const tile = document.createElement('div');
    tile.className = 'game-tile';
    tile.dataset.symbol = symbol;
    tile.dataset.index = index;
    tile.innerText = '';
    
    // Use event listener instead of inline onclick
    tile.addEventListener('click', () => {
      handleTileClick(tile);
    });
    
    gameBoard.appendChild(tile);
  });
  
  // Start countdown
  startCountdown();
}

// Handle countdown timer
function startCountdown() {
  // Clear any existing timer
  clearInterval(gameTimer);
  
  // Start new timer
  gameTimer = setInterval(() => {
    timeRemaining--;
    const timerText = document.getElementById('timerText');
    const timerContainer = document.getElementById('timerContainer');
    
    // Update timer display
    timerText.innerText = timeRemaining;
    
    // Add warning when time is low
    if (timeRemaining <= 10) {
      timerContainer.classList.add('timer-warning');
      if (timeRemaining <= 5) {
        playSound('tickSound');
      }
    }
    
    // End game if time runs out
    if (timeRemaining <= 0) {
      clearInterval(gameTimer);
      endGame(false);
    }
  }, 1000);
}

// End game function
function endGame(won) {
  // Stop timer
  clearInterval(gameTimer);
  document.getElementById('timerContainer').style.display = 'none';
  
  if (won) {
    celebrateWin();
  } else {
    playSound('timeoutSound');
    document.getElementById('gameBoard').style.display = 'none';
    
    // Show game over message
    const instructionsBox = document.getElementById('instructionsBox');
    instructionsBox.style.display = 'block';
    instructionsBox.style.opacity = '1';
    instructionsBox.innerHTML = `
      <h1>Time's Up!</h1>
      <p>You ran out of time. Would you like to try again?</p>
      <button class="start-button" id="playAgainButton">Play Again</button>
    `;
    
    // Add event listener to new button
    document.getElementById('playAgainButton').addEventListener('click', startGame);
  }
}

// Handle tile clicks
function handleTileClick(tile) {
  // Ignore clicks if not clickable or already revealed
  if (!canClick || tile.innerText !== '') return;
  
  // Play click sound
  playSound('clickSound');
  
  // Show symbol
  tile.innerText = tile.dataset.symbol;
  
  if (!firstTile) {
    // First tile clicked
    firstTile = tile;
  } else {
    // Second tile clicked
    canClick = false;
    
    if (firstTile.dataset.symbol === tile.dataset.symbol && firstTile !== tile) {
      // Match found
      playSound('matchSound');
      firstTile = null;
      canClick = true;
      checkWin();
    } else {
      // No match
      setTimeout(() => {
        tile.innerText = '';
        firstTile.innerText = '';
        firstTile = null;
        canClick = true;
      }, 1000);
    }
  }
}

// Check if all matches have been found
function checkWin() {
  const allTiles = document.querySelectorAll('.game-tile');
  const allRevealed = Array.from(allTiles).every(tile => tile.innerText !== '');
  
  if (allRevealed) {
    clearInterval(gameTimer);
    document.getElementById('timerContainer').style.display = 'none';
    celebrateWin();
  }
}

// Celebration when game is won
function celebrateWin() {
  document.getElementById('gameBoard').style.display = 'none';
  document.getElementById('instructionsBox').style.opacity = '0';
  
  // Play sounds
  playSound('winSound');
  playSound('envelopeSound');
  
  // Create visual effects
  createConfetti();
  showBirthdayMessage();
  
  // Play the Bowie message audio
  setTimeout(() => {
    const audioPlayer = document.getElementById('audioPlayer');
    if (audioPlayer) {
      audioPlayer.load();
      audioPlayer.play().catch(e => console.error("Audio play error:", e));
    }
  }, 500);
}

// Show birthday message
function showBirthdayMessage() {
  const birthdayMessage = document.getElementById('birthdayMessage');
  birthdayMessage.style.display = 'flex';
  birthdayMessage.style.opacity = '1';
}

// Create confetti effect
function createConfetti() {
  const confettiContainer = document.getElementById('confetti');
  const colors = ['#ff8563', '#ffce47', '#a5dd9b', '#60c1e8', '#f588eb'];
  
  // Clear any existing confetti
  confettiContainer.innerHTML = '';
  
  // Create 100 confetti pieces
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'absolute';
    confetti.style.width = Math.random() * 10 + 5 + 'px';
    confetti.style.height = Math.random() * 10 + 'px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = -20 + 'px';
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    confetti.style.opacity = Math.random() * 0.7 + 0.3;
    confettiContainer.appendChild(confetti);
    
    const duration = Math.random() * 3 + 2;
    const rotation = Math.random() * 360;
    
    // Animate confetti
    confetti.animate([
      { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
      { transform: `translateY(100vh) rotate(${rotation}deg)`, opacity: 0 }
    ], {
      duration: duration * 1000,
      easing: 'cubic-bezier(0.17, 0.67, 0.83, 0.67)',
      fill: 'forwards'
    });
    
    // Remove confetti after animation
    setTimeout(() => {
      confetti.remove();
    }, duration * 1000);
  }
}

// Setup for mobile audio
function setupAudioForMobile() {
  document.addEventListener('touchstart', function() {
    // Create and play a silent sound to unlock audio on iOS
    const silentSound = document.createElement('audio');
    silentSound.setAttribute('src', 'data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACcQCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgAAAAA=');
    silentSound.volume = 0.01;
    silentSound.play().then(() => {
      console.log("Audio unlocked for mobile");
    }).catch(e => {
      console.log("Failed to unlock audio:", e);
    });
  }, {once: true});
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM fully loaded");
  
  // Setup mobile audio
  setupAudioForMobile();
  
  // Add start button event listener
  const startButton = document.querySelector('.start-button');
  if (startButton) {
    console.log("Start button found, adding event listener");
    startButton.addEventListener('click', function(event) {
      console.log("Start button clicked");
      event.preventDefault();
      startGame();
    });
  } else {
    console.error("Start button not found!");
  }
});