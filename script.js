const symbols = ['⚡','👩‍🎤','🎸','꩜','🚀','🛸','💽','👨‍🚀','🎵','🌈','🔮','👽'];
const tiles = symbols.concat(symbols); // double the symbols for matching
let firstTile = null;
let canClick = true;
let gameTimer;
let timeRemaining = 120;

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const soundBuffers = {};

// Preload sounds for better performance
const preloadSounds = () => {
  const sounds = [
    { id: 'clickSound', url: './mouse-click-sound-233951.mp3' },
    { id: 'matchSound', url: './bubblepop-254773.mp3' },
    { id: 'winSound', url: './success-fanfare-trumpets-6185.mp3' },
    { id: 'envelopeSound', url: './envelope-open-sound.mp3' },
    { id: 'tickSound', url: './clock-tick.mp3' },
    { id: 'timeoutSound', url: './timeout-buzzer.mp3' },
  ];

  sounds.forEach(sound => {
    fetch(sound.url)
      .then(response => response.arrayBuffer())
      .then(data => audioContext.decodeAudioData(data))
      .then(buffer => {
        soundBuffers[sound.id] = buffer;
      });
  });
};

// Play sound using preloaded buffers
const playSound = (soundId) => {
  if (soundBuffers[soundId]) {
    const source = audioContext.createBufferSource();
    source.buffer = soundBuffers[soundId];
    source.connect(audioContext.destination);
    source.start(0);
  }
};

function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function startGame() {
  const gameBoard = document.getElementById('gameBoard');
  const timerContainer = document.getElementById('timerContainer');
  const timerText = document.getElementById('timerText');
  const instructionsBox = document.getElementById('instructionsBox'); // Reference to the instructions box
  
  // Hide the instructions window
  instructionsBox.style.display = 'none';
  
  // Reset game state
  document.getElementById('audioContainer').style.display = 'none';
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
      
      // Optional: play a tick sound when time is low
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
  playSound('clickSound');

  tile.innerText = tile.dataset.symbol;

  if (!firstTile) {
    firstTile = tile;
  } else {
    canClick = false;
    if (firstTile.dataset.symbol === tile.dataset.symbol && firstTile !== tile) {
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
  
  playSound('winSound');
  playSound('envelopeSound');
  
  createConfetti();
  showBirthdayMessage();
  
  setTimeout(() => {
    const audioContainer = document.getElementById('audioContainer');
    audioContainer.classList.add('reveal');
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

// Preload sounds on page load
window.addEventListener('DOMContentLoaded', preloadSounds);