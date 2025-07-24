// Depth First Search Algorithm Implementation
const findShortestPathDFS = async (el) => {
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
    let parent = new Array(cnt).fill(-1);
    let costs = new Array(cnt).fill(Infinity);
    costs[source] = 0;
    
    // DFS function
    const dfs = async (node, cost) => {
      visited[node] = true;
      
      // Visualize current node being processed
      if (node !== source && (!target || node !== target)) {
        document.getElementById(node).classList.add("visited-node");
        await wait(animationSpeed / 2);
      }
      
      // If we found the target, we can stop this branch
      if (target !== null && node === target) {
        return true;
      }
      
      // Check all neighbors
      for (let neighbor = 0; neighbor < cnt; neighbor++) {
        // Skip if no connection or already visited
        if (dist[node][neighbor] === Infinity || visited[neighbor]) {
          continue;
        }
        
        // Calculate new cost
        const newCost = cost + dist[node][neighbor];
        
        // Update cost if better path found
        if (newCost < costs[neighbor]) {
          costs[neighbor] = newCost;
          parent[neighbor] = node;
        }
        
        // Visualize node being considered
        if (neighbor !== source && (!target || neighbor !== target)) {
          document.getElementById(neighbor).classList.add("considering-node");
          await wait(animationSpeed / 4);
        }
        
        // Continue DFS with this neighbor
        const found = await dfs(neighbor, newCost);
        if (target !== null && found) {
          return true;
        }
      }
      
      return false;
    };
    
    // Start DFS from source
    await dfs(source, 0);
    
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