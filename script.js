const symbols = ['⚡','👩‍🎤','🎸','꩜','🚀','🛸','💽','👨‍🚀','🎵','🌈','🔮','👽'];
const tiles = symbols.concat(symbols); // double the symbols for matching
let firstTile = null;
let canClick = true;
let gameTimer;
let timeRemaining = 120;

function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function startGame() {
  const gameBoard = document.getElementById('gameBoard');
  const timerContainer = document.getElementById('timerContainer');
  const timerText = document.getElementById('timerText');
  
  // Reset game state
  document.getElementById('audioContainer').style.display = 'none';
  document.getElementById('birthdayMessage').style.display = 'none';
  document.getElementById('instructionsBox').style.opacity = '1';
  gameBoard.style.display = 'flex';
  gameBoard.innerHTML = '';
  timeRemaining = 120;
  timerText.innerText = timeRemaining;
  
  // Show timer
  timerContainer.style.display = 'flex';
  timerContainer.classList.remove('timer-warning');

  const shuffled = shuffleArray([...tiles]);
  shuffled.forEach((symbol, index) => {
    const tile = document.createElement('div');
    tile.className = 'game-tile';
    tile.dataset.symbol = symbol;
    tile.dataset.index = index;
    tile.innerText = '';
    tile.onclick = () => handleTileClick(tile);
    gameBoard.appendChild(tile);
  });
  
  // Start the countdown
  startCountdown();
}

function startCountdown() {
  // Clear any existing timer
  clearInterval(gameTimer);
  
  gameTimer = setInterval(() => {
    timeRemaining--;
    const timerText = document.getElementById('timerText');
    const timerContainer = document.getElementById('timerContainer');
    timerText.innerText = timeRemaining;
    
    // Add warning style when time is running low
    if (timeRemaining <= 10) {
      timerContainer.classList.add('timer-warning');
      
      // Optional: play a tick sound when time is low
      if (timeRemaining <= 5) {
        const tickSound = document.getElementById('tickSound');
        if (tickSound) {
          tickSound.currentTime = 0;
          tickSound.play().catch(e => console.log("Could not play tick sound"));
        }
      }
    }
    
    if (timeRemaining <= 0) {
      clearInterval(gameTimer);
      endGame(false);
    }
  }, 1000);
}

function endGame(won) {
  // Stop the timer
  clearInterval(gameTimer);
  
  // Hide the timer
  document.getElementById('timerContainer').style.display = 'none';
  
  if (won) {
    // Current win logic
    celebrateWin();
  } else {
    // Time ran out
    const timeoutSound = document.getElementById('timeoutSound');
    if (timeoutSound) {
      timeoutSound.currentTime = 0;
      timeoutSound.play().catch(e => console.log("Could not play timeout sound"));
    }
    
    document.getElementById('gameBoard').style.display = 'none';
    document.getElementById('instructionsBox').style.opacity = '1';
    
    // Update instructions to show game over message
    const instructionsBox = document.getElementById('instructionsBox');
    instructionsBox.innerHTML = `
      <h1>Time's Up!</h1>
      <p>You ran out of time. Would you like to try again?</p>
      <button class="start-button" onclick="startGame()">Play Again</button>
    `;
  }
}

function handleTileClick(tile) {
  if (!canClick || tile.innerText !== '') return;
  const clickSound = document.getElementById('clickSound');
  clickSound.currentTime = 0;
  clickSound.play();

  tile.innerText = tile.dataset.symbol;

  if (!firstTile) {
    firstTile = tile;
  } else {
    canClick = false;
    if (firstTile.dataset.symbol === tile.dataset.symbol && firstTile !== tile) {
      const matchSound = document.getElementById('matchSound');
      matchSound.currentTime = 0;
      matchSound.play();
      firstTile = null;
      canClick = true;
      checkWin();
    } else {
      setTimeout(() => {
        tile.innerText = '';
        firstTile.innerText = '';
        firstTile = null;
        canClick = true;
      }, 1000);
    }
  }
}

function checkWin() {
  const allTiles = document.querySelectorAll('.game-tile');
  const allRevealed = [...allTiles].every(tile => tile.innerText !== '');
  if (allRevealed) {
    // Player won - stop timer and celebrate
    clearInterval(gameTimer);
    document.getElementById('timerContainer').style.display = 'none';
    celebrateWin();
  }
}

function celebrateWin() {
  // Hide the game board and instructions
  document.getElementById('gameBoard').style.display = 'none';
  document.getElementById('instructionsBox').style.opacity = '0';
  
  // Play win sound
  const winSound = document.getElementById('winSound');
  if(winSound) {
    winSound.currentTime = 0;
    winSound.play();
  }
  
  // Play envelope sound
  const envelopeSound = document.getElementById('envelopeSound');
  if(envelopeSound) {
    envelopeSound.currentTime = 0;
    envelopeSound.play();
  }
  
  // Create confetti
  createConfetti();
  
  // Show the birthday message immediately and prominently
  showBirthdayMessage();
  
  // Show audio player with animation effect
  setTimeout(() => {
    const audioContainer = document.getElementById('audioContainer');
    audioContainer.classList.add('reveal');
    
    // Play the audio explicitly
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.load(); // Important to refresh the audio element
    audioPlayer.play().catch(e => console.error("Audio play error:", e));
  }, 500);
}

// Dedicated function to ensure birthday message shows
function showBirthdayMessage() {
  const birthdayMessage = document.getElementById('birthdayMessage');
  
  // Force the message to be visible with inline styles
  birthdayMessage.style.display = 'block';
  birthdayMessage.style.opacity = '1';
  birthdayMessage.style.visibility = 'visible';
  
  // Create a backup timer to show the message again if needed
  setTimeout(() => {
    console.log("Re-ensuring birthday message visibility");
    birthdayMessage.style.display = 'block';
    birthdayMessage.style.opacity = '1';
    birthdayMessage.style.visibility = 'visible';
  }, 2500);
}

function createConfetti() {
  const confettiContainer = document.getElementById('confetti');
  const colors = ['#ff8563', '#ffce47', '#a5dd9b', '#60c1e8', '#f588eb'];
  
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'absolute';
    confetti.style.width = Math.random() * 10 + 5 + 'px';
    confetti.style.height = Math.random() * 10 + 5 + 'px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = -20 + 'px';
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    confetti.style.opacity = Math.random() * 0.7 + 0.3;
    
    confettiContainer.appendChild(confetti);
    
    // Animate confetti
    const duration = Math.random() * 3 + 2;
    const rotation = Math.random() * 360;
    
    confetti.animate([
      { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
      { transform: `translateY(100vh) rotate(${rotation}deg)`, opacity: 0 }
    ], {
      duration: duration * 1000,
      easing: 'cubic-bezier(0.17, 0.67, 0.83, 0.67)',
      fill: 'forwards'
    });
    
    // Remove confetti element after animation
    setTimeout(() => {
      confetti.remove();
    }, duration * 1000);
  }
}

// Initialize elements on page load
window.addEventListener('DOMContentLoaded', () => {
  console.log("Page loaded, initializing elements");
});