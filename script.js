const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 5,
  snakeY = 10;
let snakeBody = [];
let velocityX = 0,
  velocityY = 0;
let setIntervalId;
let score = 0;
let level = 1;
let levelThreshold = 15; // Skor untuk level berikutnya
let intervalTime = 125; // Interval awal untuk setInterval

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const changeFoodPosition = () => {
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};

const handleGameOver = () => {
  clearInterval(setIntervalId);
  Swal.fire({
    title: "Game Over",
    text: "mff y nt",
    icon: "error",
    confirmButtonText: "Restart",
  }).then(() => {
    location.reload();
  });
};

const changeDirection = (e) => {
  const key = e.key || e.dataset.key;
  if (key === "ArrowUp" || key === "W" || key === "w") {
    if (velocityY !== 1) {
      velocityX = 0;
      velocityY = -1;
      console.log("NORTH");
    }
  } else if (key === "ArrowDown" || key === "S" || key === "s") {
    if (velocityY !== -1) {
      velocityX = 0;
      velocityY = 1;
      console.log("SOUTH");
    }
  } else if (key === "ArrowLeft" || key === "A" || key === "a") {
    if (velocityX !== 1) {
      velocityX = -1;
      velocityY = 0;
      console.log("WEST");
    }
  } else if (key === "ArrowRight" || key === "D" || key === "d") {
    if (velocityX !== -1) {
      velocityX = 1;
      velocityY = 0;
      console.log("EAST");
    }
  }
};

controls.forEach((key) => {
  key.addEventListener("click", () =>
    changeDirection({ key: key.dataset.key })
  );
});

// Menghindari duplikasi event listener
document.addEventListener("keydown", (e) => {
  e.preventDefault(); // Tambahkan ini jika perlu
  changeDirection(e);
});

// ambahkan untuk tombol arah dan WASD
window.addEventListener("keydown", changeDirection);

const updateLevelAndSpeed = () => {
  if (score >= levelThreshold) {
    level++;
    levelThreshold += 15;
    intervalTime = Math.max(50, intervalTime - 10); // NGURANGIN interval biar permainan lebih cepat, dengan batas minimum 50ms
    clearInterval(setIntervalId);
    setIntervalId = setInterval(initGame, intervalTime);
    console.log(`Level: ${level}`);
  }
};

const initGame = () => {
  if (gameOver) return handleGameOver();
  let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

  if (snakeX === foodX && snakeY === foodY) {
    changeFoodPosition();
    snakeBody.push([foodX, foodY]);
    score++;

    highScore = score >= highScore ? score : highScore;
    localStorage.setItem("high-score", highScore);
    scoreElement.innerText = `Score: ${score}`;
    highScoreElement.innerText = `High Score: ${highScore}`;

    updateLevelAndSpeed();
    level++; // BUAT NINGKAT LEVEL KLO MAU
  }

  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }

  snakeBody[0] = [snakeX, snakeY];

  snakeX += velocityX;
  snakeY += velocityY;

  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    gameOver = true;
  }

  for (let i = 0; i < snakeBody.length; i++) {
    htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    if (
      i !== 0 &&
      snakeBody[0][0] === snakeBody[i][0] &&
      snakeBody[0][1] === snakeBody[i][1]
    ) {
      gameOver = true;
    }
  }
  playBoard.innerHTML = htmlMarkup;
};

changeFoodPosition();
setIntervalId = setInterval(initGame, intervalTime);
document.addEventListener("keydown", changeDirection);
