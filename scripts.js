const emojiSets = {
    easy: ['🍎', '🍌', '🍇', '🍒'],
    medium: ['🍎', '🍌', '🍇', '🍒', '🍓', '🍍', '🥝', '🍉'],
    hard: ['🍎', '🍌', '🍇', '🍒', '🍓', '🍍', '🥝', '🍉', '🍑', '🥥', '🍋', '🍊']
  };
  
  let shuffledCards = [];
  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let timerInterval;
  let secondsElapsed = 0;
  let moves = 0;
  
  const timerElement = document.getElementById('timer');
  const movesElement = document.getElementById('moves');
  
  // const matchSound = new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_7e7f1f4cd7.mp3');
  // const noMatchSound = new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_f4ef70dbfa.mp3');
  // const flipSound = new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_9764e0501b.mp3');
  
  function getDifficulty() {
    return document.getElementById('difficulty').value;
  }
  
  function startGame() {
    clearInterval(timerInterval);
    secondsElapsed = 0;
    moves = 0;
    timerElement.textContent = 0;
    movesElement.textContent = 0;
  
    const level = getDifficulty();
    const cardSet = emojiSets[level];
    shuffledCards = [...cardSet, ...cardSet].sort(() => 0.5 - Math.random());
  
    const board = document.getElementById('gameBoard');
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${level === 'hard' ? 6 : 4}, 100px)`;
  
    firstCard = secondCard = null;
    lockBoard = false;
  
    shuffledCards.forEach((emoji, index) => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.dataset.emoji = emoji;
      card.dataset.index = index;
      card.innerText = '';
      card.addEventListener('click', flipCard);
      board.appendChild(card);
    });
  
    timerInterval = setInterval(() => {
      secondsElapsed++;
      timerElement.textContent = secondsElapsed;
    }, 1000);
  
    renderScores();
  }
  
  function flipCard() {
    if (lockBoard || this === firstCard) return;
  
    // flipSound.play(); // Commented out to remove audio error
    this.classList.add('flipped');
    this.innerText = this.dataset.emoji;
  
    if (!firstCard) {
      firstCard = this;
      return;
    }
  
    secondCard = this;
    lockBoard = true;
    moves++;
    movesElement.textContent = moves;
  
    if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
      // matchSound.play(); // Commented out to remove audio error
      disableCards();
    } else {
      // noMatchSound.play(); // Commented out to remove audio error
      unflipCards();
    }
  
    checkWin();
  }
  
  function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetTurn();
  }
  
  function unflipCards() {
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      firstCard.innerText = '';
      secondCard.innerText = '';
      resetTurn();
    }, 1000);
  }
  
  function resetTurn() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
  }
  
  function checkWin() {
    const flipped = document.querySelectorAll('.card.flipped');
    if (flipped.length === shuffledCards.length) {
      clearInterval(timerInterval);
      setTimeout(() => {
        alert(`🎉 You won in ${secondsElapsed}s with ${moves} moves!`);
        saveScore();
      }, 300);
    }
  }
  
  function saveScore() {
    const level = getDifficulty();
    const score = { time: secondsElapsed, moves };
    let scores = JSON.parse(localStorage.getItem(`scores-${level}`)) || [];
    scores.push(score);
    scores.sort((a, b) => a.time - b.time || a.moves - b.moves);
    scores = scores.slice(0, 5);
    localStorage.setItem(`scores-${level}`, JSON.stringify(scores));
    renderScores();
  }
  
  function renderScores() {
    const level = getDifficulty();
    const scoreList = document.getElementById('scoreList');
    const scores = JSON.parse(localStorage.getItem(`scores-${level}`)) || [];
    scoreList.innerHTML = '';
    scores.forEach((score, i) => {
      const li = document.createElement('li');
      li.textContent = `#${i + 1}: ${score.time}s | ${score.moves} moves`;
      scoreList.appendChild(li);
    });
  }
  
  startGame();
  