// Grid-based pathfinding algorithms

// BFS algorithm for grid
async function runBFS(grid, startRow, startCol, endRow, endCol) {
  const rows = grid.length;
  const cols = grid[0].length;
  
  // Validate input coordinates
  if (startRow < 0 || startRow >= rows || startCol < 0 || startCol >= cols ||
      endRow < 0 || endRow >= rows || endCol < 0 || endCol >= cols) {
    console.error("Start or end position is out of bounds");
    return [[], []];
  }
  
  // Check if start or end is on a wall
  if (grid[startRow][startCol] === 0 || grid[endRow][endCol] === 0) {
    console.error("Start or end position is on a wall");
    return [[], []];
  }
  
  // Arrays for tracking visited cells and the path
  const visited = [];
  const path = [];
  
  // Queue for BFS
  const queue = [[startRow, startCol]];
  
  // Track visited cells and their parents
  const visitedCells = new Set();
  visitedCells.add(`${startRow},${startCol}`);
  
  // Track parent cells for path reconstruction
  const parents = {};
  
  // Directions: up, right, down, left (only 4 directions, no diagonals)
  const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
  
  // BFS algorithm
  while (queue.length > 0) {
    const [row, col] = queue.shift();
    visited.push([row, col]);
    
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
      
      // Check if the new position is valid and not visited (max 19 rows)
      const maxRows = Math.min(rows, 19);
      if (
        newRow >= 0 && newRow < maxRows &&
        newCol >= 0 && newCol < cols &&
        grid[newRow][newCol] === 1 &&
        !visitedCells.has(newPos)
      ) {
        queue.push([newRow, newCol]);
        visitedCells.add(newPos);
        parents[newPos] = `${row},${col}`;
      }
    }
  }
  
  // No path found
  return [visited, []];
}

// DFS algorithm for grid
async function runDFS(grid, startRow, startCol, endRow, endCol) {
  const rows = grid.length;
  const cols = grid[0].length;
  
  // Validate input coordinates
  if (startRow < 0 || startRow >= rows || startCol < 0 || startCol >= cols ||
      endRow < 0 || endRow >= rows || endCol < 0 || endCol >= cols) {
    console.error("Start or end position is out of bounds");
    return [[], []];
  }
  
  // Check if start or end is on a wall
  if (grid[startRow][startCol] === 0 || grid[endRow][endCol] === 0) {
    console.error("Start or end position is on a wall");
    return [[], []];
  }
  
  // Arrays for tracking visited cells and the path
  const visited = [];
  const path = [];
  
  // Track visited cells
  const visitedCells = new Set();
  
  // Track parent cells for path reconstruction
  const parents = {};
  
  // Directions: up, right, down, left (only 4 directions, no diagonals)
  const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
  
  // DFS recursive function
  function dfs(row, col) {
    // Check if we reached the end
    if (row === endRow && col === endCol) {
      return true;
    }
    
    // Check all four directions
    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;
      const newPos = `${newRow},${newCol}`;
      
      // Check if the new position is valid and not visited (max 19 rows)
      const maxRows = Math.min(rows, 19);
      if (
        newRow >= 0 && newRow < maxRows &&
        newCol >= 0 && newCol < cols &&
        grid[newRow][newCol] === 1 &&
        !visitedCells.has(newPos)
      ) {
        visited.push([newRow, newCol]);
        visitedCells.add(newPos);
        parents[newPos] = `${row},${col}`;
        
        if (dfs(newRow, newCol)) {
          return true;
        }
      }
    }
    
    return false;
  }
  
  // Start DFS
  visitedCells.add(`${startRow},${startCol}`);
  visited.push([startRow, startCol]);
  const found = dfs(startRow, startCol);
  
  // Reconstruct path if end was found
  if (found) {
    let current = `${endRow},${endCol}`;
    while (current !== `${startRow},${startCol}`) {
      const [r, c] = current.split(',').map(Number);
      path.unshift([r, c]);
      current = parents[current];
    }
  }
  
  return [visited, path];
}

// Dijkstra's algorithm for grid
async function runDijkstra(grid, startRow, startCol, endRow, endCol) {
  const rows = grid.length;
  const cols = grid[0].length;
  
  // Validate input coordinates
  if (startRow < 0 || startRow >= rows || startCol < 0 || startCol >= cols ||
      endRow < 0 || endRow >= rows || endCol < 0 || endCol >= cols) {
    console.error("Start or end position is out of bounds");
    return [[], []];
  }
  
  // Check if start or end is on a wall
  if (grid[startRow][startCol] === 0 || grid[endRow][endCol] === 0) {
    console.error("Start or end position is on a wall");
    return [[], []];
  }
  
  // Arrays for tracking visited cells and the path
  const visited = [];
  const path = [];
  
  // Priority queue (simple array implementation)
  const queue = [[startRow, startCol, 0]]; // [row, col, distance]
  
  // Track distances and visited cells
  const distances = {};
  const visitedCells = new Set();
  
  // Initialize distances
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      distances[`${r},${c}`] = Infinity;
    }
  }
  distances[`${startRow},${startCol}`] = 0;
  
  // Track parent cells for path reconstruction
  const parents = {};
  
  // Directions: up, right, down, left (only 4 directions, no diagonals)
  const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
  
  // Dijkstra's algorithm
  while (queue.length > 0) {
    // Sort queue by distance (priority queue)
    queue.sort((a, b) => a[2] - b[2]);
    
    const [row, col, dist] = queue.shift();
    const pos = `${row},${col}`;
    
    // Skip if already visited
    if (visitedCells.has(pos)) continue;
    
    // Mark as visited
    visitedCells.add(pos);
    visited.push([row, col]);
    
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
      
      // Check if the new position is valid (max 19 rows)
      const maxRows = Math.min(rows, 19);
      if (
        newRow >= 0 && newRow < maxRows &&
        newCol >= 0 && newCol < cols &&
        grid[newRow][newCol] === 1
      ) {
        const newDist = dist + 1; // All edges have weight 1
        
        if (newDist < distances[newPos]) {
          distances[newPos] = newDist;
          parents[newPos] = pos;
          queue.push([newRow, newCol, newDist]);
        }
      }
    }
  }
  
  // No path found
  return [visited, []];
}

// A* algorithm for grid
async function runAStar(grid, startRow, startCol, endRow, endCol) {
  const rows = grid.length;
  const cols = grid[0].length;
  
  // Validate input coordinates
  if (startRow < 0 || startRow >= rows || startCol < 0 || startCol >= cols ||
      endRow < 0 || endRow >= rows || endCol < 0 || endCol >= cols) {
    console.error("Start or end position is out of bounds");
    return [[], []];
  }
  
  // Check if start or end is on a wall
  if (grid[startRow][startCol] === 0 || grid[endRow][endCol] === 0) {
    console.error("Start or end position is on a wall");
    return [[], []];
  }
  
  // Arrays for tracking visited cells and the path
  const visited = [];
  const path = [];
  
  // Priority queue (simple array implementation)
  const openSet = [[startRow, startCol, 0, heuristic(startRow, startCol, endRow, endCol)]]; // [row, col, g, f]
  
  // Track g scores (cost from start) and f scores (g + heuristic)
  const gScore = {};
  const fScore = {};
  
  // Initialize scores
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      gScore[`${r},${c}`] = Infinity;
      fScore[`${r},${c}`] = Infinity;
    }
  }
  gScore[`${startRow},${startCol}`] = 0;
  fScore[`${startRow},${startCol}`] = heuristic(startRow, startCol, endRow, endCol);
  
  // Track visited cells and parent cells
  const visitedCells = new Set();
  const parents = {};
  
  // Directions: up, right, down, left (only 4 directions, no diagonals)
  const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
  
  // A* algorithm
  while (openSet.length > 0) {
    // Sort by f score (priority queue)
    openSet.sort((a, b) => a[3] - b[3]);
    
    const [row, col, g, f] = openSet.shift();
    const pos = `${row},${col}`;
    
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
      
      // Check if the new position is valid
      if (
        newRow >= 0 && newRow < rows &&
        newCol >= 0 && newCol < cols &&
        grid[newRow][newCol] === 1 &&
        !visitedCells.has(newPos)
      ) {
        const tentativeG = g + 1; // All edges have weight 1
        
        if (tentativeG < gScore[newPos]) {
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