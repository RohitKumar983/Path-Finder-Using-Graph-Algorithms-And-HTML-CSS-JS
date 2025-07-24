// Algorithm Comparison Feature

// Function to compare all algorithms
async function compareAlgorithms() {
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
    return;
  }
  
  // Check if start or end is on a wall
  if (gridArray[startRow][startCol] === 0 || gridArray[endRow][endCol] === 0) {
    alert('Start or end position cannot be on a wall');
    return;
  }
  
  // Clear previous visualization
  clearVisualization();
  
  // Create comparison modal
  createComparisonModal();
  
  // Run all algorithms and collect results
  const results = {};
  
  // BFS
  const bfsStartTime = performance.now();
  const [bfsVisited, bfsPath] = await runBFS(gridArray, startRow, startCol, endRow, endCol);
  const bfsEndTime = performance.now();
  results.bfs = {
    name: 'Breadth First Search',
    time: ((bfsEndTime - bfsStartTime) / 1000).toFixed(4),
    visited: bfsVisited.length,
    path: bfsPath.length
  };
  
  // DFS
  const dfsStartTime = performance.now();
  const [dfsVisited, dfsPath] = await runDFS(gridArray, startRow, startCol, endRow, endCol);
  const dfsEndTime = performance.now();
  results.dfs = {
    name: 'Depth First Search',
    time: ((dfsEndTime - dfsStartTime) / 1000).toFixed(4),
    visited: dfsVisited.length,
    path: dfsPath.length
  };
  
  // Dijkstra
  const dijkstraStartTime = performance.now();
  const [dijkstraVisited, dijkstraPath] = await runDijkstra(gridArray, startRow, startCol, endRow, endCol);
  const dijkstraEndTime = performance.now();
  results.dijkstra = {
    name: 'Dijkstra\'s Algorithm',
    time: ((dijkstraEndTime - dijkstraStartTime) / 1000).toFixed(4),
    visited: dijkstraVisited.length,
    path: dijkstraPath.length
  };
  
  // A*
  const astarStartTime = performance.now();
  const [astarVisited, astarPath] = await runAStar(gridArray, startRow, startCol, endRow, endCol);
  const astarEndTime = performance.now();
  results.astar = {
    name: 'A* Search',
    time: ((astarEndTime - astarStartTime) / 1000).toFixed(4),
    visited: astarVisited.length,
    path: astarPath.length
  };
  
  // Display results in the comparison modal
  displayComparisonResults(results);
  
  // Show the comparison modal
  document.getElementById('comparison-modal').style.display = 'block';
}

// Create comparison modal
function createComparisonModal() {
  // Check if modal already exists
  let modal = document.getElementById('comparison-modal');
  if (modal) {
    return;
  }
  
  // Create modal elements
  modal = document.createElement('div');
  modal.id = 'comparison-modal';
  modal.className = 'modal';
  
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  
  const closeBtn = document.createElement('span');
  closeBtn.className = 'close-modal';
  closeBtn.innerHTML = '&times;';
  closeBtn.onclick = function() {
    modal.style.display = 'none';
  };
  
  const title = document.createElement('h2');
  title.id = 'comparison-title';
  title.textContent = 'Algorithm Comparison';
  
  const content = document.createElement('div');
  content.id = 'comparison-content';
  
  // Assemble modal
  modalContent.appendChild(closeBtn);
  modalContent.appendChild(title);
  modalContent.appendChild(content);
  modal.appendChild(modalContent);
  
  // Add to document
  document.body.appendChild(modal);
  
  // Close modal when clicking outside
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
}

// Display comparison results
function displayComparisonResults(results) {
  const content = document.getElementById('comparison-content');
  
  // Create table
  const table = document.createElement('table');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';
  table.style.marginTop = '20px';
  
  // Create header row
  const headerRow = document.createElement('tr');
  
  const headers = ['Algorithm', 'Execution Time (s)', 'Cells Visited', 'Path Length'];
  headers.forEach(headerText => {
    const header = document.createElement('th');
    header.textContent = headerText;
    header.style.padding = '8px';
    header.style.backgroundColor = '#10a881';
    header.style.color = 'white';
    header.style.textAlign = 'left';
    headerRow.appendChild(header);
  });
  
  table.appendChild(headerRow);
  
  // Add data rows
  const algorithms = ['bfs', 'dfs', 'dijkstra', 'astar'];
  algorithms.forEach(algo => {
    const row = document.createElement('tr');
    
    // Algorithm name
    const nameCell = document.createElement('td');
    nameCell.textContent = results[algo].name;
    nameCell.style.padding = '8px';
    nameCell.style.borderBottom = '1px solid #ddd';
    row.appendChild(nameCell);
    
    // Execution time
    const timeCell = document.createElement('td');
    timeCell.textContent = results[algo].time;
    timeCell.style.padding = '8px';
    timeCell.style.borderBottom = '1px solid #ddd';
    row.appendChild(timeCell);
    
    // Cells visited
    const visitedCell = document.createElement('td');
    visitedCell.textContent = results[algo].visited;
    visitedCell.style.padding = '8px';
    visitedCell.style.borderBottom = '1px solid #ddd';
    row.appendChild(visitedCell);
    
    // Path length
    const pathCell = document.createElement('td');
    pathCell.textContent = results[algo].path || 'No path found';
    pathCell.style.padding = '8px';
    pathCell.style.borderBottom = '1px solid #ddd';
    row.appendChild(pathCell);
    
    table.appendChild(row);
  });
  
  // Clear previous content
  content.innerHTML = '';
  
  // Add explanation
  const explanation = document.createElement('p');
  explanation.textContent = 'This table compares the performance of different pathfinding algorithms on the current grid configuration.';
  explanation.style.marginBottom = '10px';
  content.appendChild(explanation);
  
  // Add table
  content.appendChild(table);
  
  // Add best algorithm recommendation
  const recommendation = document.createElement('div');
  recommendation.style.marginTop = '20px';
  recommendation.style.padding = '10px';
  recommendation.style.backgroundColor = '#f0f0f0';
  recommendation.style.borderRadius = '4px';
  
  // Find fastest algorithm
  let fastest = algorithms[0];
  algorithms.forEach(algo => {
    if (parseFloat(results[algo].time) < parseFloat(results[fastest].time)) {
      fastest = algo;
    }
  });
  
  // Find most efficient (least visited cells)
  let mostEfficient = algorithms[0];
  algorithms.forEach(algo => {
    if (results[algo].visited < results[mostEfficient].visited) {
      mostEfficient = algo;
    }
  });
  
  // Find shortest path
  let shortestPath = null;
  algorithms.forEach(algo => {
    if (results[algo].path > 0 && (!shortestPath || results[algo].path < results[shortestPath].path)) {
      shortestPath = algo;
    }
  });
  
  recommendation.innerHTML = `
    <p><strong>Recommendations:</strong></p>
    <ul>
      <li>Fastest algorithm: <strong>${results[fastest].name}</strong> (${results[fastest].time}s)</li>
      <li>Most efficient algorithm: <strong>${results[mostEfficient].name}</strong> (visited ${results[mostEfficient].visited} cells)</li>
      ${shortestPath ? `<li>Shortest path: <strong>${results[shortestPath].name}</strong> (${results[shortestPath].path} cells)</li>` : ''}
    </ul>
  `;
  
  content.appendChild(recommendation);
}

// Add comparison button to UI
document.addEventListener('DOMContentLoaded', function() {
  // Create comparison button
  const compareBtn = document.createElement('button');
  compareBtn.className = 'outline-btn compare-btn';
  compareBtn.textContent = 'Compare Algorithms';
  compareBtn.style.marginLeft = '15px';
  compareBtn.style.backgroundColor = 'rgba(147, 112, 219, 0.2)';
  
  compareBtn.addEventListener('click', compareAlgorithms);
  
  // Add to controls
  setTimeout(() => {
    const leftControls = document.querySelector('.left-controls');
    if (leftControls) {
      leftControls.appendChild(compareBtn);
    }
  }, 500); // Small delay to ensure other elements are loaded
});