const symbols = ['⚡','👩‍🎤','🎸','꩜','🚀','🛸','💽','👨‍🚀','🎵','🌈','🔮','👽'];
const tiles = symbols.concat(symbols); // double the symbols for matching
let firstTile = null;
let canClick = true;
let gameTimer;
let timeRemaining = 120;

// Function to play sounds using HTML5 audio elements
const playSound = (soundId) => {
  try {
    const audioElement = document.getElementById(soundId);
    if (audioElement) {
      audioElement.currentTime = 0; // Reset to start
      audioElement.play().catch(e => console.error(`Error playing ${soundId}:`, e));
    }
  } catch (error) {
    console.error(`Error playing sound ${soundId}:`, error);
  }
};

// Make sure audio can play on iOS and other mobile browsers
function setupAudioForMobile() {
  document.addEventListener('touchstart', function() {
    // Create and play a silent sound to unlock audio on iOS
    const silentSound = document.createElement('audio');
    silentSound.setAttribute('src', 'data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACcQCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgAAAAA=');
    silentSound.volume = 0.01; // Nearly silent
    silentSound.play().then(() => {
      console.log("Audio unlocked for mobile");
    }).catch(e => {
      console.log("Failed to unlock audio:", e);
    });
  }, {once: true});
}

function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function startGame() {
  const gameBoard = document.getElementById('gameBoard');
  const timerContainer = document.getElementById('timerContainer');
  const timerText = document.getElementById('timerText');
  const instructionsBox = document.getElementById('instructionsBox');
  
  // Hide the instructions window
  instructionsBox.style.display = 'none';
  
  // Reset game state
  document.getElementById('birthdayMessage').style.display = 'none';
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
      // Play a tick sound when time is low
      if (timeRemaining <= 5) {
        playSound('tickSound');
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
    celebrateWin();
  } else {
    playSound('timeoutSound');
    document.getElementById('gameBoard').style.display = 'none';
    
    // Show and update instructions with game over message
    const instructionsBox = document.getElementById('instructionsBox');
    instructionsBox.style.display = 'block';
    instructionsBox.style.opacity = '1';
    instructionsBox.innerHTML = `
      <h1>Time's Up!</h1>
      <p>You ran out of time. Would you like to try again?</p>
      <button class="start-button" onclick="startGame()">Play Again</button>
    `;
  }
}

function handleTileClick(tile) {
  if (!canClick || tile.innerText !== '') return;

  // Play click sound
  playSound('clickSound');

  tile.innerText = tile.dataset.symbol;

  if (!firstTile) {
    firstTile = tile;
  } else {
    canClick = false;
    if (firstTile.dataset.symbol === tile.dataset.symbol && firstTile !== tile) {
      // Play match sound
      playSound('matchSound');
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
    clearInterval(gameTimer);
    document.getElementById('timerContainer').style.display = 'none';
    celebrateWin();
  }
}

function celebrateWin() {
  document.getElementById('gameBoard').style.display = 'none';
  document.getElementById('instructionsBox').style.opacity = '0';
  
  // Play win and envelope sounds
  playSound('winSound');
  playSound('envelopeSound');
  createConfetti();
  showBirthdayMessage();
  
  // Play the Bowie message audio
  setTimeout(() => {
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.load();
    audioPlayer.play().catch(e => console.error("Audio play error:", e));
  }, 500);
}

function showBirthdayMessage() {
  const birthdayMessage = document.getElementById('birthdayMessage');
  birthdayMessage.style.display = 'flex';
  birthdayMessage.style.opacity = '1';
}

function createConfetti() {
  const confettiContainer = document.getElementById('confetti');
  const colors = ['#ff8563', '#ffce47', '#a5dd9b', '#60c1e8', '#f588eb'];
  
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
    
    confetti.animate([
      { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
      { transform: `translateY(100vh) rotate(${rotation}deg)`, opacity: 0 }
    ], {
      duration: duration * 1000,
      easing: 'cubic-bezier(0.17, 0.67, 0.83, 0.67)',
      fill: 'forwards'
    });
    
    setTimeout(() => {
      confetti.remove();
    }, duration * 1000);
  }
}

// Initialize audio for mobile devices
window.addEventListener('DOMContentLoaded', () => {
  setupAudioForMobile();
});