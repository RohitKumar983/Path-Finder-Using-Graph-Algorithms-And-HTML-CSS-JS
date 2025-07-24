// Grid Maze Generation and Interaction

// Current tool selection
let currentTool = 'wall'; // Default tool: wall, start, end, erase

// Track if we have start and end points
let hasStartPoint = false;
let hasEndPoint = false;

// Initialize grid interaction
document.addEventListener('DOMContentLoaded', function() {
  setupGridInteraction();
  setupToolSelection();
  setupSpeedControl();
  setupMazeGeneration();
});

// Setup grid cell interaction
function setupGridInteraction() {
  // Add event listeners to grid cells
  const grid = document.getElementById('pathfinding-grid');
  
  // Use event delegation for better performance
  grid.addEventListener('mousedown', handleCellClick);
  grid.addEventListener('mouseover', handleCellDrag);
  
  // Track mouse state for drag operations
  let isMouseDown = false;
  document.addEventListener('mousedown', () => isMouseDown = true);
  document.addEventListener('mouseup', () => isMouseDown = false);
  
  // Handle cell click
  function handleCellClick(event) {
    const cell = event.target;
    if (!cell.classList.contains('grid-cell')) return;
    
    applyTool(cell);
  }
  
  // Handle cell drag
  function handleCellDrag(event) {
    if (!isMouseDown) return;
    
    const cell = event.target;
    if (!cell.classList.contains('grid-cell')) return;
    
    // Only allow drawing walls or erasing during drag
    if (currentTool === 'wall' || currentTool === 'erase') {
      applyTool(cell);
    }
  }
  
  // Add touch support for mobile devices
  grid.addEventListener('touchstart', handleTouchStart, { passive: false });
  grid.addEventListener('touchmove', handleTouchMove, { passive: false });
  
  let lastTouchedCell = null;
  
  function handleTouchStart(event) {
    event.preventDefault();
    const touch = event.touches[0];
    const cell = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (cell && cell.classList.contains('grid-cell')) {
      lastTouchedCell = cell;
      applyTool(cell);
    }
  }
  
  function handleTouchMove(event) {
    event.preventDefault();
    const touch = event.touches[0];
    const cell = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (cell && cell.classList.contains('grid-cell') && cell !== lastTouchedCell) {
      lastTouchedCell = cell;
      
      // Only allow drawing walls or erasing during drag
      if (currentTool === 'wall' || currentTool === 'erase') {
        applyTool(cell);
      }
    }
  }
}

// Apply the selected tool to a cell
function applyTool(cell) {
  // Check if clicking on the same type of cell (for toggling)
  const isWall = cell.classList.contains('wall-cell');
  const isStart = cell.classList.contains('start-cell');
  const isEnd = cell.classList.contains('end-cell');
  
  // Store state before removing classes
  const wasStart = isStart;
  const wasEnd = isEnd;
  
  // Toggle functionality - if clicking on the same type of cell as the current tool
  if ((currentTool === 'wall' && isWall) || 
      (currentTool === 'start' && isStart) || 
      (currentTool === 'end' && isEnd)) {
    // Remove the class (toggle off)
    cell.classList.remove('wall-cell', 'start-cell', 'end-cell');
    
    // Update tracking variables
    if (wasStart) hasStartPoint = false;
    if (wasEnd) hasEndPoint = false;
    
    return; // Exit early after toggling off
  }
  
  // If not toggling, remove existing classes
  cell.classList.remove('wall-cell', 'start-cell', 'end-cell');
  
  // Apply the selected tool
  switch (currentTool) {
    case 'wall':
      cell.classList.add('wall-cell');
      break;
      
    case 'start':
      // Remove start class from any existing start cell
      if (hasStartPoint) {
        const existingStart = document.querySelector('.start-cell');
        if (existingStart) {
          existingStart.classList.remove('start-cell');
        }
      }
      
      cell.classList.add('start-cell');
      hasStartPoint = true;
      break;
      
    case 'end':
      // Remove end class from any existing end cell
      if (hasEndPoint) {
        const existingEnd = document.querySelector('.end-cell');
        if (existingEnd) {
          existingEnd.classList.remove('end-cell');
        }
      }
      
      cell.classList.add('end-cell');
      hasEndPoint = true;
      break;
      
    case 'erase':
      // Update tracking variables if needed
      if (wasStart) hasStartPoint = false;
      if (wasEnd) hasEndPoint = false;
      break;
  }
}

// Setup tool selection
function setupToolSelection() {
  // Add tool selection functionality
  const nodeTypes = document.querySelectorAll('.node-type');
  
  nodeTypes.forEach(nodeType => {
    nodeType.addEventListener('click', function() {
      // Remove selected class from all tools
      nodeTypes.forEach(nt => nt.classList.remove('selected-tool'));
      
      // Add selected class to clicked tool
      this.classList.add('selected-tool');
      
      // Set current tool based on the clicked node type
      if (this.querySelector('.source-node')) {
        currentTool = 'start';
      } else if (this.querySelector('.target-node')) {
        currentTool = 'end';
      } else if (this.querySelector('.obstacle-node')) {
        currentTool = 'wall';
      } else if (this.querySelector('.path-node')) {
        currentTool = 'erase';
      }
    });
  });
  
  // Set wall as the default selected tool
  const wallTool = document.querySelector('.node-type:nth-child(3)');
  if (wallTool) {
    wallTool.classList.add('selected-tool');
  }
}

// Setup animation speed control
function setupSpeedControl() {
  // Create speed control elements
  const controlsDiv = document.querySelector('.simplified-controls');
  
  const speedControlDiv = document.createElement('div');
  speedControlDiv.className = 'speed-control';
  speedControlDiv.style.display = 'flex';
  speedControlDiv.style.alignItems = 'center';
  speedControlDiv.style.gap = '8px';
  speedControlDiv.style.marginLeft = '15px';
  
  const speedLabel = document.createElement('label');
  speedLabel.textContent = 'Speed:';
  speedLabel.style.color = '#fff';
  speedLabel.style.fontSize = '0.85rem';
  
  const speedSelect = document.createElement('select');
  speedSelect.id = 'animation-speed';
  
  const speeds = [
    { value: '5', text: 'Very Fast' },
    { value: '10', text: 'Fast' },
    { value: '25', text: 'Normal' },
    { value: '50', text: 'Slow' },
    { value: '100', text: 'Very Slow' }
  ];
  
  speeds.forEach(speed => {
    const option = document.createElement('option');
    option.value = speed.value;
    option.textContent = speed.text;
    if (speed.value === '10') {
      option.selected = true;
    }
    speedSelect.appendChild(option);
  });
  
  speedSelect.addEventListener('change', function() {
    // Update the animation speed
    window.animationSpeed = parseInt(this.value);
  });
  
  speedControlDiv.appendChild(speedLabel);
  speedControlDiv.appendChild(speedSelect);
  
  // Add to controls
  const leftControls = controlsDiv.querySelector('.left-controls');
  leftControls.appendChild(speedControlDiv);
  
  // Set default animation speed
  window.animationSpeed = 10;
}

// Setup maze generation
function setupMazeGeneration() {
  // Create maze generation button
  const controlsDiv = document.querySelector('.simplified-controls');
  
  const mazeButton = document.createElement('button');
  mazeButton.className = 'outline-btn maze-btn';
  mazeButton.textContent = 'Generate Maze';
  mazeButton.style.marginLeft = '15px';
  
  mazeButton.addEventListener('click', generateRandomMaze);
  
  // Add to controls
  const leftControls = controlsDiv.querySelector('.left-controls');
  leftControls.appendChild(mazeButton);
}

// Generate a random maze using recursive division
function generateRandomMaze() {
  // Clear the grid first
  clearGrid();
  
  const grid = document.getElementById('pathfinding-grid');
  const rows = parseInt(getComputedStyle(grid).gridTemplateRows.split(' ').length);
  const cols = parseInt(getComputedStyle(grid).gridTemplateColumns.split(' ').length);
  
  // Create walls around the perimeter
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (i === 0 || i === rows - 1 || j === 0 || j === cols - 1) {
        const cell = document.querySelector(`.grid-cell[data-row="${i}"][data-col="${j}"]`);
        if (cell) {
          cell.classList.add('wall-cell');
        }
      }
    }
  }
  
  // Recursively divide the maze
  recursiveDivision(1, rows - 2, 1, cols - 2);
  
  // Add random start and end points
  addRandomStartEnd(rows, cols);
}

// Recursive division maze generation algorithm
function recursiveDivision(startRow, endRow, startCol, endCol) {
  if (endRow - startRow < 2 || endCol - startCol < 2) {
    return;
  }
  
  // Decide whether to divide horizontally or vertically
  const width = endCol - startCol;
  const height = endRow - startRow;
  const horizontal = Math.random() < width / (width + height);
  
  if (horizontal) {
    // Divide horizontally
    const divisionRow = Math.floor(Math.random() * (endRow - startRow - 1)) + startRow + 1;
    const passageCol = Math.floor(Math.random() * (endCol - startCol + 1)) + startCol;
    
    // Create horizontal wall
    for (let j = startCol; j <= endCol; j++) {
      if (j !== passageCol) {
        const cell = document.querySelector(`.grid-cell[data-row="${divisionRow}"][data-col="${j}"]`);
        if (cell) {
          cell.classList.add('wall-cell');
        }
      }
    }
    
    // Recursively divide the two new sections
    recursiveDivision(startRow, divisionRow - 1, startCol, endCol);
    recursiveDivision(divisionRow + 1, endRow, startCol, endCol);
    
  } else {
    // Divide vertically
    const divisionCol = Math.floor(Math.random() * (endCol - startCol - 1)) + startCol + 1;
    const passageRow = Math.floor(Math.random() * (endRow - startRow + 1)) + startRow;
    
    // Create vertical wall
    for (let i = startRow; i <= endRow; i++) {
      if (i !== passageRow) {
        const cell = document.querySelector(`.grid-cell[data-row="${i}"][data-col="${divisionCol}"]`);
        if (cell) {
          cell.classList.add('wall-cell');
        }
      }
    }
    
    // Recursively divide the two new sections
    recursiveDivision(startRow, endRow, startCol, divisionCol - 1);
    recursiveDivision(startRow, endRow, divisionCol + 1, endCol);
  }
}

// Add random start and end points
function addRandomStartEnd(rows, cols) {
  // Find cells that are not walls
  const emptyCells = [];
  
  for (let i = 1; i < rows - 1; i++) {
    for (let j = 1; j < cols - 1; j++) {
      const cell = document.querySelector(`.grid-cell[data-row="${i}"][data-col="${j}"]`);
      if (cell && !cell.classList.contains('wall-cell')) {
        emptyCells.push(cell);
      }
    }
  }
  
  // Shuffle the empty cells
  for (let i = emptyCells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [emptyCells[i], emptyCells[j]] = [emptyCells[j], emptyCells[i]];
  }
  
  // Add start and end points if we have enough empty cells
  if (emptyCells.length >= 2) {
    // Start point
    emptyCells[0].classList.add('start-cell');
    hasStartPoint = true;
    
    // End point - make sure it's far from start
    emptyCells[emptyCells.length - 1].classList.add('end-cell');
    hasEndPoint = true;
  }
}