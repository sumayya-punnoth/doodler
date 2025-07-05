const welcomeScreen = document.getElementById('welcome')
const startBtn = document.getElementById('startBtn');
const levels = document.getElementById('levels')
const level1 = document.getElementById('level1');
const level2 = document.getElementById('level2');
const level3 = document.getElementById('level3');

startBtn.addEventListener('click', () =>{
  welcomeScreen.style.display = 'none';
  levels.style.display = 'block';
});

// ### COLOURING GAME ###
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const playBtn = document.getElementById('playButton');
const startScreen = document.getElementById('startScreen');
const canvasScreen = document.getElementById('canvasScreen');

const colorPicker = document.getElementById('color');
const brushSize = document.getElementById('brushSize');
const clearBtn = document.getElementById('clear');
const pointsDisplay = document.getElementById('points');

let painting = false;
let points = 100;
let lastX, lastY;
let imageLoaded = false;

const outlineImg = new Image();
outlineImg.src = 'images.png'; // your outline drawing
outlineImg.onload = () => {
  imageLoaded = true;
};

level1.addEventListener('click', () => {
  if (imageLoaded) {
    levels.style.display = 'none';
    canvasScreen.style.display = 'block';
    ctx.drawImage(outlineImg, 0, 0, canvas.width, canvas.height);
  }
});

function startPosition(e) {
  if (!imageLoaded) return;
  painting = true;
  [lastX, lastY] = getMousePos(canvas, e);
  draw(e);
}

function endPosition() {
  painting = false;
  ctx.beginPath();
}

function draw(e) {
  if (!painting) return;

  const [x, y] = getMousePos(canvas, e);
  const size = brushSize.value;
  const color = colorPicker.value;

  const pixel = ctx.getImageData(x, y, 1, 1).data;
  const isOnBlackLine = pixel[0] < 50 && pixel[1] < 50 && pixel[2] < 50;

  if (isOnBlackLine && points > 0) {
    points--;
    pointsDisplay.textContent = `Points: ${points}`;
  }

  ctx.strokeStyle = color;
  ctx.lineWidth = size;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();

  [lastX, lastY] = [x, y];
}

function clearCanvas() {
  if (imageLoaded) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(outlineImg, 0, 0, canvas.width, canvas.height);
    points = 100;
    pointsDisplay.textContent = `Points: ${points}`;
  }
}

function getMousePos(canvas, evt) {
  const rect = canvas.getBoundingClientRect();
  return [
    evt.clientX - rect.left,
    evt.clientY - rect.top
  ];
}

canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mouseout', endPosition);
canvas.addEventListener('mousemove', draw);
clearBtn.addEventListener('click', clearCanvas);

