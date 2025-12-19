const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Ball
let ballX = WIDTH / 2;
let ballY = HEIGHT - 50;
let dx = 3;
let dy = -3;
const ballRadius = 8;

// Paddle
const paddleWidth = 80;
const paddleHeight = 10;
let paddleX = (WIDTH - paddleWidth) / 2;

// Bricks
const brickRowCount = 5;
const brickColumnCount = 8;
const brickWidth = 50;
const brickHeight = 15;
const brickPadding = 10;
const brickOffsetTop = 40;
const brickOffsetLeft = 25;

let score = 0;
let lives = 3;

// Brick grid (like 2D array in C)
const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, alive: true };
  }
}

// Input
let rightPressed = false;
let leftPressed = false;

document.addEventListener('keydown', e => {
  if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
    rightPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
    leftPressed = true;
  }
});

document.addEventListener('keyup', e => {
  if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
    rightPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
    leftPressed = false;
  }
});

function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, HEIGHT - paddleHeight - 5, paddleWidth, paddleHeight);
  ctx.fillStyle = '#0f0';
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].alive) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = '#f60';
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawScoreAndLives() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#fff';
  ctx.fillText('Score: ' + score, 10, 20);
  ctx.fillText('Lives: ' + lives, WIDTH - 90, 20);
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.alive) {
        if (
          ballX > b.x &&
          ballX < b.x + brickWidth &&
          ballY > b.y &&
          ballY < b.y + brickHeight
        ) {
          dy = -dy;
          b.alive = false;
          score += 10;

          let allGone = true;
          for (let cc = 0; cc < brickColumnCount; cc++) {
            for (let rr = 0; rr < brickRowCount; rr++) {
              if (bricks[cc][rr].alive) {
                allGone = false;
              }
            }
          }
          if (allGone) {
            alert('YOU WIN! Final Score: ' + score);
            document.location.reload();
          }
        }
      }
    }
  }
}

function update() {
  ballX += dx;
  ballY += dy;

  // Walls
  if (ballX + dx > WIDTH - ballRadius || ballX + dx < ballRadius) {
    dx = -dx;
  }
  if (ballY + dy < ballRadius) {
    dy = -dy;
  } else if (ballY + dy > HEIGHT - ballRadius - paddleHeight - 5) {
    if (ballX > paddleX && ballX < paddleX + paddleWidth) {
      dy = -dy;
    } else if (ballY > HEIGHT) {
      lives--;
      if (!lives) {
        alert('GAME OVER. Final Score: ' + score);
        document.location.reload();
      } else {
        ballX = WIDTH / 2;
        ballY = HEIGHT - 50;
        dx = 3;
        dy = -3;
        paddleX = (WIDTH - paddleWidth) / 2;
      }
    }
  }

  // Paddle movement
  if (rightPressed && paddleX < WIDTH - paddleWidth) {
    paddleX += 6;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 6;
  }

  collisionDetection();
}

function gameLoop() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScoreAndLives();
  update();
  requestAnimationFrame(gameLoop);
}

gameLoop();