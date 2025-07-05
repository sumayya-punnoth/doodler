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


window.onload = generateMaze;
