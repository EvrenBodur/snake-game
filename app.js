const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const score = document.querySelector(".score");

canvas.width = 400;
canvas.height = 400;
const grid = 20;

class Board {
  constructor() {
    this.cols = this.rows = grid;
  }
  drawBoard = () => {
    for (let i = this.cols; i < canvas.width; i += this.cols) {
      ctx.strokeStyle = "grey";
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }

    for (let i = this.rows; i < canvas.height; i += this.rows) {
      ctx.strokeStyle = "grey";
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }
  };
}

class Snake {
  constructor() {
    this.x = (Math.floor(Math.random() * grid - 1) + 1) * grid;
    this.y = (Math.floor(Math.random() * grid - 1) + 1) * grid;
    this.speedX = grid;
    this.speedY = 0;
    this.tailNumber = 0;
    this.score = 0;
    this.tail = [];
  }
  drawSnake = () => {
    ctx.fillStyle = "white";
    for (let i = 0; i < this.tail.length; i++) {
      ctx.fillRect(this.tail[i].x, this.tail[i].y, grid, grid);
    }
    ctx.fillRect(this.x, this.y, grid, grid);
  };

  update = () => {
    for (let i = 0; i < this.tail.length - 1; i++) {
      this.tail[i] = this.tail[i + 1];
    }

    this.tail[this.tailNumber - 1] = { x: this.x, y: this.y };

    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > canvas.width - grid) this.x = 0;
    if (this.x < 0) this.x = canvas.width;
    if (this.y > canvas.height - grid) this.y = 0;
    if (this.y < 0) this.y = canvas.height;
  };

  controller = (e) => {
    switch (e.code) {
      case "KeyW":
        if (
          (this.speedX === 0 && this.speedY === -grid) ||
          this.speedY === grid
        )
          break;
        this.speedX = 0;
        this.speedY = -grid;
        break;
      case "KeyA":
        if (
          (this.speedY === 0 && this.speedX === -grid) ||
          this.speedX === grid
        )
          break;
        this.speedX = -grid;
        this.speedY = 0;
        break;
      case "KeyS":
        if (
          (this.speedX === 0 && this.speedY === grid) ||
          this.speedY === -grid
        )
          break;
        this.speedX = 0;
        this.speedY = grid;
        break;
      case "KeyD":
        if (
          (this.speedY === 0 && this.speedX === grid) ||
          this.speedX === -grid
        )
          break;
        this.speedX = grid;
        this.speedY = 0;
        break;
    }
  };

  addTail = () => {
    this.tailNumber++;
  };

  eatFood = (food) => {
    if (this.x === food.x && this.y === food.y) {
      this.score += 10;
      score.innerText = this.score;
      return true;
    }
    return false;
  };

  collision = () => {
    for (let tail of this.tail) {
      if (this.x === tail.x && this.y === tail.y) {
        this.tailNumber = 0;
        this.tail = [];
        this.score = 0;
        score.innerText = this.score;
      }
    }
  };
}

class Food {
  constructor() {
    this.x;
    this.y;
  }

  randomLocation = () => {
    this.x = (Math.floor(Math.random() * grid - 1) + 1) * grid;
    this.y = (Math.floor(Math.random() * grid - 1) + 1) * grid;
  };

  drawFood = () => {
    ctx.fillStyle = "tomato";
    ctx.fillRect(this.x, this.y, grid, grid);
  };
}

function init() {
  const board = new Board();
  const snake = new Snake();
  const food = new Food();

  window.document.addEventListener("keydown", snake.controller);

  food.randomLocation();

  setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    board.drawBoard();
    food.drawFood();
    snake.drawSnake();
    snake.update();

    if (snake.eatFood(food)) {
      food.randomLocation();
      snake.addTail();
    }

    snake.collision();
  }, 100);
}

init();
