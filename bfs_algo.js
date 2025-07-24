// Breadth First Search Algorithm Implementation
const findShortestPathBFS = async (el) => {
  return new Promise(async (resolve) => {
    clearScreen();

    // Get source and target nodes
    let source = Number(document.getElementById("source-node").value);
    let target = Number(document.getElementById("target-node").value);
    
    // Validate source node
    if (source >= cnt || isNaN(source)) {
      alert("Invalid source node");
      resolve();
      return;
    }
    
    // Validate target node
    if (target >= cnt || isNaN(target)) {
      // If target is invalid, we'll find paths to all nodes
      target = null;
    }
    
    // Mark source node
    document.getElementById(source).style.backgroundColor = "grey";
    
    // Initialize data structures
    let visited = new Array(cnt).fill(false);
    let queue = [source];
    let parent = new Array(cnt).fill(-1);
    visited[source] = true;
    
    // BFS algorithm
    while (queue.length > 0) {
      let current = queue.shift();
      
      // Visualize current node being processed
      if (current !== source && (!target || current !== target)) {
        document.getElementById(current).classList.add("visited-node");
        await wait(animationSpeed / 2);
      }
      
      // If we found the target, we can stop
      if (target !== null && current === target) {
        break;
      }
      
      // Check all neighbors
      for (let neighbor = 0; neighbor < cnt; neighbor++) {
        // Skip if no connection or already visited
        if (dist[current][neighbor] === Infinity || visited[neighbor]) {
          continue;
        }
        
        // Mark as visited and add to queue
        visited[neighbor] = true;
        parent[neighbor] = current;
        queue.push(neighbor);
        
        // Visualize node being considered
        if (neighbor !== source && (!target || neighbor !== target)) {
          document.getElementById(neighbor).classList.add("considering-node");
          await wait(animationSpeed / 4);
        }
      }
    }
    
    // Calculate costs (in BFS, cost is number of edges)
    let costs = new Array(cnt).fill(Infinity);
    costs[source] = 0;
    
    for (let i = 0; i < cnt; i++) {
      if (visited[i]) {
        let current = i;
        let cost = 0;
        
        // Trace back to source to calculate cost
        while (current !== source && parent[current] !== -1) {
          cost += dist[current][parent[current]];
          current = parent[current];
        }
        
        costs[i] = cost;
      }
    }
    
    // Display results
    if (target !== null) {
      // Show path to specific target
      await indicateSpecificPath(parent, source, target, costs);
    } else {
      // Show paths to all nodes
      await indicatePath(parent, source, costs);
    }
    
    // Resolve the promise when done
    resolve();
  });
};