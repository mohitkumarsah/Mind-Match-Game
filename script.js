const gameBoard = document.getElementById("game-board");
const levelNumber = document.getElementById("level-number");
const movesCount = document.getElementById("moves-count");
const timerDisplay = document.getElementById("timer");
const levelCompleteBox = document.getElementById("level-complete");
const countdown = document.getElementById("countdown");

let level = 1;
let timer;
let seconds = 0;
let flipped = [];
let lockBoard = false;
let matched = 0;
let moves = 0;

const emojis = ["🍎", "🍌", "🍇", "🍉", "🍓", "🍒", "🥝", "🍍", "🥥", "🍋", "🍑", "🍅", "🍈"];

function formatTime(s) {
  const min = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${min}:${sec}`;
}

function startTimer() {
  seconds = 0;
  timerDisplay.textContent = "00:00";
  clearInterval(timer);
  timer = setInterval(() => {
    seconds++;
    timerDisplay.textContent = formatTime(seconds);
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function setupBoard() {
  gameBoard.innerHTML = "";
  flipped = [];
  matched = 0;
  moves = 0;
  movesCount.textContent = moves;
  levelNumber.textContent = level;

  const pairs = 2 + level * 2;
  const selected = emojis.slice(0, pairs);
  const cards = shuffle([...selected, ...selected]);

  const columns = Math.ceil(Math.sqrt(cards.length));
  gameBoard.style.gridTemplateColumns = `repeat(${columns}, 80px)`;

  cards.forEach(icon => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.icon = icon;
    card.textContent = "?";

    card.addEventListener("click", () => flipCard(card));

    gameBoard.appendChild(card);
  });

  startTimer();
}

function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

function flipCard(card) {
  if (lockBoard || card.classList.contains("flipped")) return;

  card.classList.add("flipped");
  card.textContent = card.dataset.icon;
  flipped.push(card);

  if (flipped.length === 2) {
    lockBoard = true;
    moves++;
    movesCount.textContent = moves;

    const [card1, card2] = flipped;
    if (card1.dataset.icon === card2.dataset.icon) {
      matched++;
      flipped = [];
      lockBoard = false;

      if (matched === gameBoard.childElementCount / 2) {
        levelComplete();
      }
    } else {
      setTimeout(() => {
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        card1.textContent = "?";
        card2.textContent = "?";
        flipped = [];
        lockBoard = false;
      }, 800);
    }
  }
}

function levelComplete() {
  stopTimer();
  levelCompleteBox.style.display = "block";

  let count = 3;
  countdown.textContent = count;

  const interval = setInterval(() => {
    count--;
    countdown.textContent = count;
    if (count === 0) {
      clearInterval(interval);
      levelCompleteBox.style.display = "none";
      level++;
      setupBoard();
    }
  }, 1000);
}

setupBoard();
