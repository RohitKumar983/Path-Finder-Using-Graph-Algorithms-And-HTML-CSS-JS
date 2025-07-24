// Global variables
let grid = document.getElementById("pathfinding-grid");
let cnt = 0;
let dist;
let animationSpeed = 1000;

// Show instructions alert on first visit
let alerted = localStorage.getItem("alerted") || "";
if (alerted !== "yes") {
  alert(
    "Read instructions before proceeding by clicking on Info button in the navigation bar"
  );
  localStorage.setItem("alerted", "yes");
}

// Initialize grid when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Initialize grid
  initializeGrid();
  
  // Initialize empty graph data structure
  dist = [];
  cnt = 0;
});

// Function to create a node at specified coordinates
const appendBlock = (x, y) => {
  // Create node element
  const block = document.createElement("div");
  block.classList.add("block");
  block.style.top = `${y}px`;
  block.style.left = `${x}px`;
  block.style.transform = `translate(-50%,-50%)`;
  block.id = cnt;
  block.innerText = cnt++;
  
  // Add node to the grid
  grid.appendChild(block);
};

// Clear visualization
const clearScreen = () => {
  document.getElementsByClassName("path")[0].innerHTML = "";
  
  // Remove all nodes
  const nodes = document.getElementsByClassName("block");
  while (nodes.length > 0) {
    nodes[0].remove();
  }
  
  // Remove all edges
  const lines = document.getElementsByClassName("line");
  while (lines.length > 0) {
    lines[0].remove();
  }
  
  // Reset counters
  cnt = 0;
  dist = [];
};

// Wait function for animations
const wait = async (t) => {
  const speed = t || animationSpeed;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("done!");
    }, speed);
  });
};

// Color an edge during path visualization
const colorEdge = async (el) => {
  if (el && el.style.backgroundColor !== "aqua") {
    await wait();
    el.style.backgroundColor = "aqua";
    el.style.height = "8px";
    el.style.boxShadow = "0 0 15px rgba(0, 255, 255, 0.8)";
  }
};

// Initialize the grid
function initializeGrid() {
  const grid = document.getElementById('pathfinding-grid');
  const rows = 19;
  const cols = 40;
  
  grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cell = document.createElement('div');
      cell.classList.add('grid-cell');
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.id = `cell-${i}-${j}`;
      grid.appendChild(cell);
    }
  }
}
