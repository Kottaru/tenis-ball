const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const W = canvas.width, H = canvas.height;

let scoreRed = 0, scoreBlue = 0;
const scoreRedEl = document.getElementById("scoreRed");
const scoreBlueEl = document.getElementById("scoreBlue");

let ball = { x: W/4, y: H/2, vx: 0, vy: 0, r: 10, color: "#fff" };
let red = { x: W/4, y: H/2, r: 20, color: "red", speed: 5 };
let blue = { x: 3*W/4, y: H/2, r: 20, color: "blue", speed: 4 };

const keys = new Set();
window.addEventListener("keydown", e => keys.add(e.code));
window.addEventListener("keyup", e => keys.delete(e.code));

function resetBall(startRed=true) {
  ball.x = startRed ? W/4 : 3*W/4;
  ball.y = H/2;
  ball.vx = 0;
  ball.vy = 0;
}

function draw() {
  ctx.clearRect(0,0,W,H);

  // rede
  ctx.fillStyle = "#fff";
  ctx.fillRect(W/2-2, 0, 4, H);

  // jogadores
  drawCircle(red.x, red.y, red.r, red.color);
  drawCircle(blue.x, blue.y, blue.r, blue.color);

  // bola
  drawCircle(ball.x, ball.y, ball.r, ball.color);
}

function drawCircle(x,y,r,color) {
  ctx.beginPath();
  ctx.arc(x,y,r,0,Math.PI*2);
  ctx.fillStyle = color;
  ctx.fill();
}

function update() {
  // movimento bola
  ball.x += ball.vx;
  ball.y += ball.vy;

  // colisão com paredes
  if (ball.y - ball.r < 0 || ball.y + ball.r > H) {
    ball.vy *= -1;
  }

  // ponto
  if (ball.x < 0) {
    scoreBlue++;
    scoreBlueEl.textContent = scoreBlue;
    resetBall(true);
  }
  if (ball.x > W) {
    scoreRed++;
    scoreRedEl.textContent = scoreRed;
    resetBall(true); // sempre reinicia com vermelho
  }

  // movimento jogador vermelho (WASD)
  if (keys.has("KeyW") && red.y - red.r > 0) red.y -= red.speed;
  if (keys.has("KeyS") && red.y + red.r < H) red.y += red.speed;
  if (keys.has("KeyA") && red.x - red.r > 0) red.x -= red.speed;
  if (keys.has("KeyD") && red.x + red.r < W/2 - 10) red.x += red.speed; // limite até a rede

  // chute vermelho
  if (keys.has("Space")) {
    const dx = ball.x - red.x, dy = ball.y - red.y;
    const dist = Math.hypot(dx,dy);
    if (dist < red.r + ball.r + 10) {
      ball.vx = 6; // manda pro azul
      ball.vy = (Math.random()-0.5)*6;
    }
  }

  // BOT azul: segue a bola
  if (ball.x > W/2) {
    if (ball.y < blue.y && blue.y - blue.r > 0) blue.y -= blue.speed;
    if (ball.y > blue.y && blue.y + blue.r < H) blue.y += blue.speed;
  }

  // chute azul automático
  const dxB = ball.x - blue.x, dyB = ball.y - blue.y;
  const distB = Math.hypot(dxB,dyB);
  if (distB < blue.r + ball.r + 10 && ball.x > W/2) {
    ball.vx = -6; // manda pro vermelho
    ball.vy = (Math.random()-0.5)*6;
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();
