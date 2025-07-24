// Function to find shortest path from given source to all other nodes
const findShortestPath = async (el) => {
  return new Promise(async (resolve) => {
    let visited = [];
    let unvisited = [];
    clearScreen();

    // Get source node from input
    let source = Number(document.getElementById("source-node").value);
    let target = Number(document.getElementById("target-node").value);
    
    // Validate source node
    if (source >= cnt || isNaN(source)) {
      alert("Invalid source node");
      resolve();
      return;
    }
    
    // Validate target node (optional)
    if (target >= cnt || isNaN(target)) {
      // If target is invalid, we'll find paths to all nodes
      target = null;
    }
    
    // Mark source node
    document.getElementById(source).style.backgroundColor = "grey";
    
    // Initialize data structures
    let parent = [];
    parent[source] = -1;
    visited = [];
    
    for (let i = 0; i < cnt; i++) {
      unvisited.push(i);
    }

    // Array containing cost of reaching i(th) node from source
    let cost = [];
    for (let i = 0; i < cnt; i++) {
      if (i === source) {
        cost[i] = 0;
      } else {
        cost[i] = dist[source][i] || Infinity;
      }
    }

    // Array which will contain final minimum cost
    let minCost = [];
    minCost[source] = 0;

    // Dijkstra's algorithm
    while (unvisited.length) {
      // Find node with minimum cost
      let mini = cost.indexOf(Math.min(...cost));
      
      // Visualize current node being processed
      if (mini !== source && (!target || mini !== target)) {
        document.getElementById(mini).classList.add("visited-node");
        await wait(animationSpeed / 2);
      }
      
      // If we found the target, we can stop
      if (target !== null && mini === target) {
        visited.push(mini);
        break;
      }
      
      visited.push(mini);
      unvisited.splice(unvisited.indexOf(mini), 1);

      // Relaxation of unvisited edges
      for (let j of unvisited) {
        if (j === mini) continue;
        
        // If there's a path and it's better than current
        if (dist[mini] && dist[mini][j] !== undefined && dist[mini][j] !== Infinity) {
          // Mark node as being considered
          if (j !== source && (!target || j !== target)) {
            document.getElementById(j).classList.add("considering-node");
          }
          
          if (cost[j] > dist[mini][j] + cost[mini]) {
            minCost[j] = dist[mini][j] + cost[mini];
            cost[j] = dist[mini][j] + cost[mini];
            parent[j] = mini;
          } else {
            minCost[j] = cost[j];
          }
        }
      }
      
      // Mark current node as processed
      cost[mini] = Infinity;
      
      // Short delay for visualization
      await wait(animationSpeed / 4);
    }
    
    console.log("Minimum Cost", minCost);
    
    // Ensure all nodes have a parent
    for (let i = 0; i < cnt; i++) {
      if (parent[i] === undefined) {
        parent[i] = source;
      }
    }
    
    // Display results
    if (target !== null) {
      // Show path to specific target
      await indicateSpecificPath(parent, source, target, minCost);
    } else {
      // Show paths to all nodes
      await indicatePath(parent, source, minCost);
    }
    
    // Resolve the promise when done
    resolve();
  });
};

// Display paths from source to all nodes
const indicatePath = async (parentArr, src, minCost) => {
  document.getElementsByClassName("path")[0].innerHTML = "";
  
  for (let i = 0; i < cnt; i++) {
    let p = document.createElement("p");
    p.innerText = `Node ${src} to ${i} --> `;
    
    if (minCost[i] !== Infinity) {
      p.innerText += src;
      await printPath(parentArr, i, p);
      p.innerText += ` (Cost = ${minCost[i]})`;
    } else {
      p.innerText += "No path exists";
    }
    
    document.getElementsByClassName("path")[0].appendChild(p);
  }
  
  document.getElementsByClassName("path")[0].style.padding = "1rem";
};

// Display path from source to specific target
const indicateSpecificPath = async (parentArr, src, target, minCost) => {
  document.getElementsByClassName("path")[0].innerHTML = "";
  
  let p = document.createElement("p");
  p.innerText = `Path from Node ${src} to ${target}: `;
  
  if (minCost[target] !== Infinity) {
    p.innerText += src;
    await printPath(parentArr, target, p);
    p.innerText += ` (Cost = ${minCost[target]})`;
    document.getElementsByClassName("path")[0].appendChild(p);
  } else {
    p.innerText += "No path exists";
    document.getElementsByClassName("path")[0].appendChild(p);
  }
  
  document.getElementsByClassName("path")[0].style.padding = "1rem";
};

// Recursively print and visualize path
const printPath = async (parent, j, el_p) => {
  if (parent[j] === -1) return;
  
  await printPath(parent, parent[j], el_p);
  el_p.innerText = el_p.innerText + " → " + j;
  
  // Highlight node in path
  document.getElementById(j).classList.add("path-node");
  
  // Highlight edge in path
  if (j < parent[j]) {
    let tmp = document.getElementById(`line-${j}-${parent[j]}`);
    await colorEdge(tmp);
  } else {
    let tmp = document.getElementById(`line-${parent[j]}-${j}`);
    await colorEdge(tmp);
  }
  
  await wait(animationSpeed / 2);
};