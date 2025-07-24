// A* Algorithm Implementation for Grid-based Pathfinding
const findShortestPathAStar = async (el) => {
  return new Promise(async (resolve) => {
    // Get grid dimensions
    const grid = document.getElementById('pathfinding-grid');
    const rows = parseInt(getComputedStyle(grid).gridTemplateRows.split(' ').length);
    const cols = parseInt(getComputedStyle(grid).gridTemplateColumns.split(' ').length);
    
    // Create a 2D grid representation
    const gridArray = Array(rows).fill().map(() => Array(cols).fill(1)); // 1 means passable
    
    // Mark walls as impassable (0)
    document.querySelectorAll('.wall-cell').forEach(wallCell => {
      const row = parseInt(wallCell.dataset.row);
      const col = parseInt(wallCell.dataset.col);
      if (row >= 0 && row < rows && col >= 0 && col < cols) {
        gridArray[row][col] = 0;
      }
    });
    
    // Get start and end cells
    const startCell = document.querySelector('.start-cell');
    const endCell = document.querySelector('.end-cell');
    
    if (!startCell || !endCell) {
      alert('Please set both start and end points');
      resolve();
      return;
    }
    
    // Get start and end positions
    const startRow = parseInt(startCell.dataset.row);
    const startCol = parseInt(startCell.dataset.col);
    const endRow = parseInt(endCell.dataset.row);
    const endCol = parseInt(endCell.dataset.col);
    
    // Validate start and end positions
    if (startRow < 0 || startRow >= rows || startCol < 0 || startCol >= cols ||
        endRow < 0 || endRow >= rows || endCol < 0 || endCol >= cols) {
      alert('Start or end position is out of bounds');
      resolve();
      return;
    }
    
    // Check if start or end is on a wall
    if (gridArray[startRow][startCol] === 0) {
      alert('Start position cannot be on a wall');
      resolve();
      return;
    }
    
    if (gridArray[endRow][endCol] === 0) {
      alert('End position cannot be on a wall');
      resolve();
      return;
    }
    
    // Clear previous visualization
    clearVisualization();
    
    // Start timing
    const startTime = performance.now();
    
    // Get animation speed from UI
    const animationSpeedSelect = document.getElementById('animation-speed');
    const animationDelay = animationSpeedSelect ? parseInt(animationSpeedSelect.value) : 10;
    
    // Run A* algorithm
    const [visitedCells, pathCells] = await runAStar(gridArray, startRow, startCol, endRow, endCol);
    
    // Visualize the visited cells
    for (let i = 0; i < visitedCells.length; i++) {
      const [row, col] = visitedCells[i];
      // Check if cell is within grid bounds (max 19 rows)
      if (row >= 0 && row < Math.min(rows, 19) && col >= 0 && col < cols) {
        const cell = document.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`);
        if (cell && !cell.classList.contains('start-cell') && !cell.classList.contains('end-cell')) {
          cell.classList.add('visited-cell');
          await new Promise(resolve => setTimeout(resolve, animationDelay));
        }
      }
    }
    
    // Visualize the path
    for (let i = 0; i < pathCells.length; i++) {
      const [row, col] = pathCells[i];
      // Check if cell is within grid bounds (max 19 rows)
      if (row >= 0 && row < Math.min(rows, 19) && col >= 0 && col < cols) {
        const cell = document.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`);
        if (cell && !cell.classList.contains('start-cell') && !cell.classList.contains('end-cell')) {
          cell.classList.add('shortest-path-cell');
          await new Promise(resolve => setTimeout(resolve, animationDelay * 5));
        }
      }
    }
    
    // Check if path is empty (no path found)
    if (pathCells.length === 0 && visitedCells.length > 0) {
      alert('No path found between start and end points!');
      const statsElement = document.getElementById('algorithm-stats');
      statsElement.innerHTML = 'No path found between start and end points! Try removing some obstacles.';
    } else {
      // Update stats
      const endTime = performance.now();
      const executionTime = ((endTime - startTime) / 1000).toFixed(2);
      const statsElement = document.getElementById('algorithm-stats');
      statsElement.innerHTML = `Algorithm: <span style="color:#fff">A* Search</span> | Execution Time: <span style="color:#fff">${executionTime}s</span> | Cells Visited: <span style="color:#fff">${visitedCells.length}</span> | Path Length: <span style="color:#fff">${pathCells.length}</span>`;
    }
    
    resolve();
  });
};

// A* algorithm for grid - optimized version
async function runAStar(grid, startRow, startCol, endRow, endCol) {
  const rows = grid.length;
  const cols = grid[0].length;
  
  // Arrays for tracking visited cells and the path
  const visited = [];
  const path = [];
  
  // Priority queue (simple array implementation)
  const openSet = [[startRow, startCol, 0, heuristic(startRow, startCol, endRow, endCol)]]; // [row, col, g, f]
  
  // Track g scores (cost from start) and f scores (g + heuristic)
  const gScore = {};
  const fScore = {};
  
  // Initialize scores only for start position (lazy initialization)
  gScore[`${startRow},${startCol}`] = 0;
  fScore[`${startRow},${startCol}`] = heuristic(startRow, startCol, endRow, endCol);
  
  // Track visited cells and parent cells
  const visitedCells = new Set();
  const parents = {};
  
  // Directions: up, right, down, left (only 4 directions, no diagonals)
  // Note: We're using a fixed maximum of 19 rows to ensure we don't go below the grid
  const maxRows = Math.min(rows, 19);
  const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
  
  // A* algorithm
  while (openSet.length > 0) {
    // Sort by f score (priority queue)
    openSet.sort((a, b) => a[3] - b[3]);
    
    const [row, col, g, f] = openSet.shift();
    const pos = `${row},${col}`;
    
    // Skip if already visited
    if (visitedCells.has(pos)) continue;
    
    // Add to visited list
    visited.push([row, col]);
    visitedCells.add(pos);
    
    // Check if we reached the end
    if (row === endRow && col === endCol) {
      // Reconstruct path
      let current = `${endRow},${endCol}`;
      while (current !== `${startRow},${startCol}`) {
        const [r, c] = current.split(',').map(Number);
        path.unshift([r, c]);
        current = parents[current];
      }
      return [visited, path];
    }
    
    // Check all four directions
    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;
      const newPos = `${newRow},${newCol}`;
      
      // Check if the new position is valid and within the 19-row limit
      if (
        newRow >= 0 && newRow < maxRows &&
        newCol >= 0 && newCol < cols &&
        grid[newRow][newCol] === 1 &&
        !visitedCells.has(newPos)
      ) {
        const tentativeG = g + 1; // All edges have weight 1
        
        // Get current g score (default to Infinity if not set)
        const currentG = gScore[newPos] !== undefined ? gScore[newPos] : Infinity;
        
        if (tentativeG < currentG) {
          parents[newPos] = pos;
          gScore[newPos] = tentativeG;
          fScore[newPos] = tentativeG + heuristic(newRow, newCol, endRow, endCol);
          
          // Add to open set if not already there
          if (!openSet.some(item => item[0] === newRow && item[1] === newCol)) {
            openSet.push([newRow, newCol, tentativeG, fScore[newPos]]);
          }
        }
      }
    }
  }
  
  // No path found
  return [visited, []];
}

// Heuristic function (Manhattan distance)
function heuristic(row1, col1, row2, col2) {
  return Math.abs(row1 - row2) + Math.abs(col1 - col2);
}

// Clear visualization but keep walls, start, and end
function clearVisualization() {
  const cells = document.querySelectorAll('.grid-cell');
  cells.forEach(cell => {
    cell.classList.remove('visited-cell', 'shortest-path-cell');
  });
}