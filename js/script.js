const startBtn = document.getElementById('start')
const gameBoard = document.getElementById('game-board')
const completionPage = document.getElementById('completion-page')
const attemptsDisplay = document.getElementById('attempts')
const timerDisplay = document.querySelector('.stop-watch')

let cards = []
let flippedCards = []
let matchedCard = []
let attempts = 0

// Start button event
startBtn.addEventListener('click', () => {
  startTimer()
  startBtn.classList.add('hidden')
  gameBoard.classList.remove('hidden')
})

// Card data and duplicate the pairs
const allCards = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

// Shuffle Cards
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    [array[i], array[j]] = [array[j], array[i]]
  }
}

// Add card elements with event listeners
function createCards() {
  shuffle(allCards)
  allCards.forEach((value) => {
    const card = document.createElement('div')
    card.classList.add('card')
    card.dataset.value = value
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">?</div>
        <div class="card-back">${value}</div>
      </div>
    `
    card.addEventListener('click', flipCard)
    gameBoard.appendChild(card)
    cards.push(card)
  })
}

// Timer
let seconds = 0
let minutes = 0
let hours = 0
let timer = null

function stopwatch() {
  seconds++
  if (seconds === 60) {
    seconds = 0
    minutes++
    if (minutes === 60) {
      minutes = 0
      hours++
    }
  }
  let h = hours < 10 ? `0${hours}` : hours
  let m = minutes < 10 ? `0${minutes}` : minutes
  let s = seconds < 10 ? `0${seconds}` : seconds
  timerDisplay.textContent = `${h}:${m}:${s}`
}

function startTimer() {
  timer = setInterval(stopwatch, 1000)
}

function resetTimer() {
  clearInterval(timer)
  seconds = 0
  minutes = 0
  hours = 0
  timerDisplay.textContent = `00:00:00`
}

// Flip Function
function flipCard() {
  if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
    this.classList.add('flipped')
    flippedCards.push(this)

    if (flippedCards.length === 2) {
      attempts++
      attemptsDisplay.textContent = attempts
      checkForMatch()
    }
  }
}

// Check for match
function checkForMatch() {
  if (flippedCards[0].dataset.value === flippedCards[1].dataset.value) {
    matchedCard.push(...flippedCards)
    flippedCards = []
    if (matchedCard.length === cards.length) {
      stopTimer()
      completionPage.classList.remove('hidden')
      completionPage.innerHTML = `
        <h2>Congratulations! You've matched all the cards!</h2>
        <p>Total attempts: <span id="attempts">${attempts}</span></p>
        <button id="play-again"><h2>Play Again</h2></button>
      `
      document.getElementById('play-again').addEventListener('click', resetGame)
    }
  } else {
    setTimeout(() => {
      flippedCards.forEach((card) => {
        card.classList.remove('flipped')
      })
      flippedCards = []
    }, 1000)
  }
}

// Reset Game
function resetGame() {
  completionPage.classList.add('hidden')
  gameBoard.innerHTML = ''
  cards = []
  matchedCard = []
  attempts = 0
  attemptsDisplay.textContent = attempts
  resetTimer()
  startTimer()
  createCards()
}

// Initialize game
createCards()
