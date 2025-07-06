const welcomeScreen = document.getElementById('welcome')
const startBtn = document.getElementById('startBtn');
const levels = document.getElementById('levels')
const level1 = document.getElementById('level1');
const level2 = document.getElementById('level2');
const level3 = document.getElementById('level3');
const backStart = document.getElementById('backStart');
const backLevel = document.getElementById('backLevel');
const backLevel1 = document.getElementById('backLevel1');

startBtn.addEventListener('click', () =>{
  welcomeScreen.style.display = 'none';
  levels.style.display = 'block';
});

backStart.addEventListener('click', () =>{
  levels.style.display = 'none';
  welcomeScreen.style.display = 'block';
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
outlineImg.src = './images/images.png'; // your outline drawing
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

backLevel.addEventListener('click', () =>{
  canvasScreen.style.display = 'none';
  levels.style.display = 'block';
});

// ### MAZE
const mazeGen = document.getElementById('mazeGen');
level2.addEventListener('click', () =>{
  levels.style.display = 'none';
  mazeGen.style.display = 'block';
  generateMaze();
});

const visibleSize = 11;
const gridSize = visibleSize * 2 - 1;
let maze = [];

function generateMaze() {
  maze = createMaze(gridSize, gridSize);

  
  carvePassages(1, 1, maze);

  
  for (let i = 0; i < gridSize; i++) {
    maze[0][i] = 0;
    maze[gridSize - 1][i] = 0;
    maze[i][0] = 0;
    maze[i][gridSize - 1] = 0;
  }

 
  maze[1][0] = 1;  
  maze[1][1] = 1;  

  maze[gridSize - 2][gridSize - 2] = 1; // Ensure path before exit
  maze[gridSize - 2][gridSize - 1] = 1; // Exit (right wall)

 
  drawMaze();
}

function createMaze(w, h) {
  const grid = [];
  for (let y = 0; y < h; y++) {
    const row = [];
    for (let x = 0; x < w; x++) {
      row.push(0); // wall
    }
    grid.push(row);
  }
  return grid;
}

function carvePassages(cx, cy, grid) {
  grid[cy][cx] = 1; 

  const directions = shuffle([
    [0, -2], [2, 0], [0, 2], [-2, 0]
  ]);

  for (const [dx, dy] of directions) {
    const nx = cx + dx;
    const ny = cy + dy;

    if (inBounds(nx, ny, gridSize) && grid[ny][nx] === 0) {
      grid[cy + dy / 2][cx + dx / 2] = 1;
      grid[ny][nx] = 1;
      carvePassages(nx, ny, grid);
    }
  }
}

function inBounds(x, y, size) {
  return x >= 0 && y >= 0 && x < size && y < size;
}

function drawMaze() {
  const container = document.getElementById("maze");
  container.innerHTML = "";

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      if (maze[y][x] === 0) {
        cell.classList.add("wall");
      } else {
        cell.classList.add("path");
      }

      container.appendChild(cell);
    }
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

backLevel1.addEventListener('click', () =>{
  mazeGen.style.display = 'none';
  levels.style.display = 'block';
});
