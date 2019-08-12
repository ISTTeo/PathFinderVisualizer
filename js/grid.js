const queueTop = 0;
const queueParent = i => ((i + 1) >>> 1) - 1;
const queueLeft = i => (i << 1) + 1;
const queueRight = i => (i + 1) << 1;

function distanceToTarget(nodeID) {
  var target = getNodeFromId(grid.target);
  var node = getNodeFromId(nodeID);
  return Math.abs(node.x - target.x) + Math.abs(node.y - target.y);
}

class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.visited = false;
    //BFS
    this.parent;

    //Djikstra, every node starts at infinity
    this.distance = Infinity;
  }
}

var canSelectCell = true;
var count = 0;
var grid = {};
var table = document.getElementById("table");
var inputs = document.getElementsByClassName("gridInput");
var stepInput = document.getElementById("stepInput");
var stepDur = 100;
stepInput.onchange = function () {
  stepDur = stepInput.valueAsNumber;
}

//Make sure grid changes when you alter an input
for (i = 0; i < inputs.length; i++) {
  inputs[i].onchange = changeGrid;
}

// TODO fix problem after resizing (node is null)
function gridDistances() {
  for (var row = 1; row < grid.height + 1; row++) {
    for (var col = 1; col < grid.width + 1; col++) {

      var id = row + "." + col;

      var cell = document.getElementById(id);
      var d = distanceToTarget(id);

      cell.innerHTML = d;

    }
  }
}

function cleanGridDistances() {
  for (var row = 1; row < grid.height + 1; row++) {
    for (var col = 1; col < grid.width + 1; col++) {

      var id = row + "." + col;

      var cell = document.getElementById(id);

      cell.innerHTML = "";

    }
  }
}
// Grid Functionality
function changeCellColor(x, y, color) {
  var cellId = y + "." + x;
  var cell = document.getElementById(cellId);
  cell.style.backgroundColor = color;
}

// Grid Functionality
function alreadyColored(x, y, color) {
  var cellId = y + "." + x;
  var cell = document.getElementById(cellId);

  return cell.style.backgroundColor == color
}

// Grid Functionality
function parseCell(id) {
  var res = {};
  var parsed = id.split(".").map(function (item) {
    return parseInt(item, 10);
  });
  res.x = parsed[1];
  res.y = parsed[0];
  return res;
}

// Grid Functionality
function initGrid(h, w) {
  count = 0;
  grid.height = h;
  grid.width = w;
  grid.origin = null;
  grid.target = null;
  grid.obstacles = [];
  grid.cells = [];
  grid.unvisited = [];
  //grid.minDistance = []; // index 0 is distance, index 1 is the id of the node

  var i, k;
  var table = "<table>";
  for (i = 0; i < grid.height; i++) {
    grid.cells.push([]);
    table += "<tr>"
    for (k = 0; k < grid.width; k++) {
      var node = new Node(k + 1, i + 1);
      grid.cells[i].push(node);
      var cellId = node.y + "." + node.x;
      table += "<td id='" + cellId + "' onclick = cellClick(event); ></td>";
      grid.unvisited.push(cellId);
    }
    table += "</tr>";

  }
  table += "</table>";
  document.getElementById("tableId").innerHTML = table;

}


// Grid Functionality
//TODO bug when you set origin in target and then set target the origin disappears
function setOrigin(x, y) {
  var id = y + "." + x;
  if (grid.origin == null) {

    grid.origin = id;
    changeCellColor(x, y, "green");

  } else {
    var oldOrigin = getNodeFromId(grid.origin);
    changeCellColor(oldOrigin.x, oldOrigin.y, "white");

    grid.origin = id;
    changeCellColor(x, y, "green");

  }
}

// Grid Functionality
function setTarget(x, y) {
  var id = y + "." + x;
  var node = getNodeFromId(id)
  if (isOrigin(node)) {
    alert("Error: already origin");
    return false;
  } else {


    if (grid.target == null) {


      grid.target = id;
      changeCellColor(x, y, "red");

    } else {
      var oldTarget = getNodeFromId(grid.target);
      changeCellColor(oldTarget.x, oldTarget.y, "white");

      grid.target = id;
      changeCellColor(x, y, "red");

    }
    return true;
  }
  


}

// Grid Functionality
function removeObstacle(obstacle) {
  changeCellColor(obstacle.x, obstacle.y, "white");
  var index = grid.obstacles.findIndex(function (el) {
    return obstacle.x == el.x && obstacle.y == el.y;
  })
  grid.obstacles.splice(1, index - 1);
}

// Grid Functionality
function setObstacle(x, y) {
  var obstacle = {};

  if (alreadyColored(x, y, "grey")) {
    obstacle.x = x;
    obstacle.y = y;
    removeObstacle(obstacle);
  } else if (alreadyColored(x, y, "green")) {
  } else if (alreadyColored(x, y, "red")) {
  } else {
    obstacle.x = x;
    obstacle.y = y;
    grid.obstacles.push(obstacle);
    changeCellColor(obstacle.x, obstacle.y, "grey");
  }

}

// Grid Functionality
function cellClick(e) {
  if (canSelectCell) {
    var id = e.target.id;

    switch (count) {
      case 0:
        var yx = parseCell(id);
        setOrigin(yx.x, yx.y, grid);
        count++;
        var item = document.querySelector(".activeCellType");
        item.classList.remove("activeCellType")
        document.getElementById("liTarget").classList.add("activeCellType");
        break;
      case 1:
        var yx = parseCell(id);
        var ok = setTarget(yx.x, yx.y, grid);
        if (ok) { count++ };
        var item = document.querySelector(".activeCellType");
        item.classList.remove("activeCellType")
        document.getElementById("liObstacle").classList.add("activeCellType");
        break;
      case 2:
        var yx = parseCell(id);
        setObstacle(yx.x, yx.y, grid);
        break;
    }
  } else {
    console.log("canSelectCell is false");
  }

}

// Grid Functionality
function changeGrid(el) {
  var w = inputs[1].value;
  var h = inputs[0].value;
  initGrid(h, w);
  setOrigin(1, 1);
  setTarget(w, h);
  enableAlgButtons();
  canSelectCell = true;
}

// Grid Functionality
function getNodeFromGrid(node) {
  return grid.cells[node.y - 1][node.x - 1];
}

// Grid Functionality
function getNodeFromId(id) {

  var res = parseCell(id);



  return grid.cells[res.y - 1][res.x - 1];

}



// Grid Functionality
function markVisited(node) {
  getNodeFromGrid(node).visited = true;
}

function markVisitedId(node) {
  getNodeFromId(node).visited = true;
}

// Grid Functionality
function isTarget(node) {
  var target = getNodeFromId(grid.target);
  return node.x == target.x && node.y == target.y;
}

// Grid Functionality
function isOrigin(node) {
  var origin = getNodeFromId(grid.origin);
  return node.x == origin.x && node.y == origin.y;
}

// Grid Functionality
function isObstacle(node) {
  var index = grid.obstacles.findIndex(function (el) {
    return node.x == el.x && node.y == el.y;
  })
  return index != -1;
}

// Grid Functionality
function isNormalNode(node) {
  return !isOrigin(node) && !isTarget(node) && !isObstacle(node);
}

function isNormalNodeFromId(id) {
  var node = getNodeFromId(id);
  return !isOrigin(node) && !isTarget(node) && !isObstacle(node);
}



// Grid Functionality
function resetGrid() {
  var row;
  var col;
  for (row = 0; row < grid.height; row++) {
    for (col = 0; col < grid.width; col++) {
      grid.cells[row][col].parent = undefined;
      grid.cells[row][col].visited = false;
      if (isNormalNode(grid.cells[row][col])) {
        changeCellColor(col + 1, row + 1, "white");
      }
    }
  }
  enableAlgButtons();
  canSelectCell = true;


}

//Used in BFS
function traceBack(node) {
  var parent = getNodeFromId(node.parent);

  while (parent.parent != undefined) {
    changeCellColor(parent.x, parent.y, "blue");
    parent = getNodeFromId(parent.parent);

  }
}
// BFS -- Start //
//TODO Proximity to the source defines how bright the color is
function stepBFS(queue, notFound) {
  if (!notFound) {
    clearInterval(bfsInterval);
  } else {
    // Remove vertex from queue to visit its neighbours
    var node = queue.pop();

    if (isObstacle(node)) {
      console.log("IS OBSTACLE" + JSON.stringify(node));
    }
    if (isNormalNode(node)) {
      changeCellColor(node.x, node.y, "#f0ce54");
    }

    //neighbours
    var leftNeighbour = null;
    var topNeighbour = null;
    var rightNeighbour = null;
    var bottomNeighbour = null;

    var id = node.y + "." + node.x;
    if (node.x != 1 && notFound) {


      leftNeighbour = grid.cells[node.y - 1][node.x - 2];
      if (!leftNeighbour.visited && !isObstacle(leftNeighbour)) {

        grid.cells[node.y - 1][node.x - 2].parent = id;
        queue.unshift(leftNeighbour);
        markVisited(leftNeighbour);
        if (isTarget(leftNeighbour)) {
          traceBack(grid.cells[node.y - 1][node.x - 2]);
          notFound = false;
        }

        if (isNormalNode(leftNeighbour)) {
          changeCellColor(leftNeighbour.x, leftNeighbour.y, "#fc7703");
        }

      }
    }
    if (node.y != 1 && notFound) {
      topNeighbour = grid.cells[node.y - 2][node.x - 1];
      if (!topNeighbour.visited && !isObstacle(topNeighbour)) {
        grid.cells[node.y - 2][node.x - 1].parent = id;
        queue.unshift(topNeighbour);
        markVisited(topNeighbour);

        if (isTarget(topNeighbour)) {
          traceBack(grid.cells[node.y - 2][node.x - 1]);
          notFound = false;
        }

        if (isNormalNode(topNeighbour)) {
          changeCellColor(topNeighbour.x, topNeighbour.y, "#fc7703");
        }
      }
    }
    if (node.x != grid.width && notFound) {
      rightNeighbour = grid.cells[node.y - 1][node.x];
      if (!rightNeighbour.visited && !isObstacle(rightNeighbour)) {
        grid.cells[node.y - 1][node.x].parent = id;
        queue.unshift(rightNeighbour);
        markVisited(rightNeighbour);

        if (isTarget(rightNeighbour)) {
          traceBack(grid.cells[node.y - 1][node.x]);
          notFound = false;
        }

        if (isNormalNode(rightNeighbour)) {
          changeCellColor(rightNeighbour.x, rightNeighbour.y, "#fc7703");
        }
      }
    }
    if (node.y != grid.height && notFound) {
      bottomNeighbour = grid.cells[node.y][node.x - 1];
      if (!bottomNeighbour.visited && !isObstacle(bottomNeighbour)) {
        grid.cells[node.y][node.x - 1].parent = id;
        queue.unshift(bottomNeighbour);
        markVisited(bottomNeighbour);

        if (isTarget(bottomNeighbour)) {
          traceBack(grid.cells[node.y][node.x - 1]);
          notFound = false;
        }

        if (isNormalNode(bottomNeighbour)) {
          changeCellColor(bottomNeighbour.x, bottomNeighbour.y, "#fc7703");
        }
      }
    }

    return [queue, notFound];
  }
}

function BFS() {
  canSelectCell = false;
  disableReset();
  disableAlgButtons();

  var notFound = true;
  var sourceNode = getNodeFromId(grid.origin);
  var queue = [];

  queue.unshift(sourceNode);
  markVisited(sourceNode);

  //setInterval instead of while to allow for animations
  var bfsInterval = setInterval(function () {
    if (!notFound || queue.length == 0) {
      clearInterval(bfsInterval);
      enableResetBtn();

    } else {
      var res = stepBFS(queue, notFound);

      queue = res[0];
      notFound = res[1];

    }

  }, stepDur);

}
// BFS -- End //


///////////////////////
function checkNeighbour(neighbourId, parentId, queue, changes, notFound){
  var neighbour = getNodeFromId(neighbourId);
  if (!neighbour.visited && !isObstacle(neighbour) && notFound[0]) {
    getNodeFromId(neighbourId).parent = parentId;
    queue.unshift(neighbourId);
    markVisitedId(neighbourId);
    if (isTarget(getNodeFromId(neighbourId))) {
      //traceBack(getNodeFromId(neighbourId));
      notFound[0] = false;
    }

    if (isNormalNode(getNodeFromId(neighbourId))) {
      //changeCellColor(neighbour.x, neighbour.y, "#fc7703");
      changes.push([neighbourId, "#fc7703"])
    }
  }
  
}
function checkNeighbours(id, queue, changes, notFound) {
  var node = getNodeFromId(id);
   //neighbours
   var neighbour = null;
   var neighbourId = null;

  if (node.x != 1) {


    neighbour = grid.cells[node.y - 1][node.x - 2];
    neighbourId = neighbour.y + "." + neighbour.x;
    checkNeighbour(neighbourId, id, queue, changes, notFound);

  }
  if (node.y != 1) {
    neighbour = grid.cells[node.y - 2][node.x - 1];
    neighbourId = neighbour.y + "." + neighbour.x;
    checkNeighbour(neighbourId, id, queue, changes, notFound);
    
  }
  if (node.x != grid.width ) {
    neighbour = grid.cells[node.y - 1][node.x];
    neighbourId = neighbour.y + "." + neighbour.x;
    checkNeighbour(neighbourId, id, queue, changes, notFound);
    
  }
  if (node.y != grid.height) {
    neighbour = grid.cells[node.y][node.x - 1];
    neighbourId = neighbour.y + "." + neighbour.x;
    checkNeighbour(neighbourId, id, queue, changes, notFound);
    
  }

}

function newTraceBack(nodeID,changes) {
  var node = getNodeFromId(nodeID);
  var parent = getNodeFromId(node.parent);
  var change = [];
  while (parent.parent != undefined) {
    var parentID = parent.y + "." + parent.x;
    change.push([parentID, "blue"]);
    parent = getNodeFromId(parent.parent);

  }
  changes.push(change);
}
function newBFS() {
  var changes = []; //holds all changes made during algorithm
  var sourceNode = getNodeFromId(grid.origin);
  var queue = [];
  var notFound = [];
  notFound[0] = true;
  queue.unshift(grid.origin);
  markVisited(sourceNode);

  while (queue.length != 0 && notFound[0]) {
    var stepChanges = []; // this one holds the changes during a single step
    var nodeId = queue.pop();
    var node = getNodeFromId(nodeId)
    if (isNormalNode(node)) {
      //changeCellColor(node.x, node.y, "#f0ce54");
      stepChanges.push([nodeId, "#f0ce54"])
    }

    checkNeighbours(nodeId, queue, stepChanges, notFound);
    changes.push(stepChanges);
  }
  console.log(changes)
  var target = getNodeFromId(grid.target);
  if(target.parent != undefined) {
    newTraceBack(grid.target, changes);
  }
  readChanges(changes)
}



function readChanges(changes) {
  
  var len = changes.length;
  var i = 0;
  console.log(len);
  var changesInterval = setInterval(function () {
    if (i == len) {
      console.log("CLEAR");
      
      clearInterval(changesInterval);
      enableResetBtn();

    } else {
      console.log(i)
      var currentChange = changes[i];
      console.log(currentChange)
      for (var k = 0; k<currentChange.length; k++) {
        var node = getNodeFromId(currentChange[k][0]);
        changeCellColor(node.x,node.y, currentChange[k][1]);
      } 

      i++;
      

    }

  }, 100);
}






// DFS - Start
function stepDFS(queue, notFound) {
  if (!notFound) {
    clearInterval(dfsInterval);
  } else {
    var nodeId = queue.pop();    

    var node = getNodeFromId(nodeId);
    if (isNormalNode(node)) {
      changeCellColor(node.x, node.y, "#f0ce54");
    }
    var neighbour = null;
    var neighbourId = null;
    if (node.x != 1 && notFound) {


      neighbour = grid.cells[node.y - 1][node.x - 2];
      neighbourId = neighbour.y + "." + neighbour.x;
      if (!neighbour.visited && !isObstacle(neighbour)) {
        markVisited(neighbour);
        if (isNormalNode(node)) {
          changeCellColor(node.x, node.y, "#fc7703");
        }
        neighbour.parent = nodeId;
        if (isTarget(neighbour)) {
          traceBack(neighbour);
          notFound = false;
        }
        queue.push(neighbourId)
      }
    }
    if (node.y != 1 && notFound) {
      neighbour = grid.cells[node.y - 2][node.x - 1];
      neighbourId = neighbour.y + "." + neighbour.x;
      if (!neighbour.visited && !isObstacle(neighbour)) {
        markVisited(neighbour);
        if (isNormalNode(node)) {
          changeCellColor(node.x, node.y, "#fc7703");
        }
        neighbour.parent = nodeId;
        if (isTarget(neighbour)) {
          traceBack(neighbour);
          notFound = false;
        }
        queue.push(neighbourId)
      }
    }
    if (node.x != grid.width && notFound) {
      neighbour = grid.cells[node.y - 1][node.x];
      neighbourId = neighbour.y + "." + neighbour.x;
      if (!neighbour.visited && !isObstacle(neighbour)) {
        markVisited(neighbour);
        if (isNormalNode(node)) {
          changeCellColor(node.x, node.y, "#fc7703");
        }
        neighbour.parent = nodeId;
        if (isTarget(neighbour)) {
          traceBack(neighbour);
          notFound = false;
        }
        queue.push(neighbourId)
      }
    }
    if (node.y != grid.height && notFound) {
      neighbour = grid.cells[node.y][node.x - 1];
      neighbourId = neighbour.y + "." + neighbour.x;
      if (!neighbour.visited && !isObstacle(neighbour)) {
        markVisited(neighbour);
        if (isNormalNode(node)) {
          changeCellColor(node.x, node.y, "#fc7703");
        }
        neighbour.parent = nodeId;
        if (isTarget(neighbour)) {
          traceBack(neighbour);
          notFound = false;

        }
        queue.push(neighbourId)
      }
    }

  }

  return [queue, notFound];
}

function DFS() {
  canSelectCell = false;
  disableReset();
  disableAlgButtons();

  var queue = [];
  var sourceNodeId = grid.origin;
  var notFound = true;

  markVisited(getNodeFromId(sourceNodeId));
  queue.push(sourceNodeId);


  //setInterval instead of while to allow for animations
  var dfsInterval = setInterval(function () {
    if (!notFound || queue.length == 0) {
      clearInterval(dfsInterval);
      enableResetBtn();

    } else {
      var res = stepDFS(queue, notFound);

      queue = res[0];
      notFound = res[1];

    }

  }, stepDur);
}

// DFS - End

//Best-First-Search Start
function bestfsStep(queue, notFound) {

    var nodeId = queue.dequeue();
    
    var node = getNodeFromId(nodeId);
    if (isNormalNode(node)) {
      changeCellColor(node.x, node.y, "#f0ce54");
    }

    var neighbour = null;
    var neighbourId = null;
    if (node.x != 1 && notFound) {
      neighbour = grid.cells[node.y - 1][node.x - 2];
      neighbourId = neighbour.y + "." + neighbour.x;
      if (!neighbour.visited && !isObstacle(neighbour)) {
        markVisited(neighbour);
        if (isNormalNode(neighbour)) {
          changeCellColor(neighbour.x, neighbour.y, "#fc7703");
        }
        neighbour.parent = nodeId;
        if (isTarget(neighbour)) {
          traceBack(neighbour);
          notFound = false;
        }
        queue.queue(neighbourId)
      }
    }
    if (node.y != 1 && notFound) {
      neighbour = grid.cells[node.y - 2][node.x - 1];
      neighbourId = neighbour.y + "." + neighbour.x;
      if (!neighbour.visited && !isObstacle(neighbour)) {
        markVisited(neighbour);
        if (isNormalNode(neighbour)) {
          changeCellColor(neighbour.x, neighbour.y, "#fc7703");
        }
        neighbour.parent = nodeId;
        if (isTarget(neighbour)) {
          traceBack(neighbour);
          notFound = false;
        }
        queue.queue(neighbourId)
      }
    }
    if (node.x != grid.width && notFound) {
      neighbour = grid.cells[node.y - 1][node.x];
      neighbourId = neighbour.y + "." + neighbour.x;
      if (!neighbour.visited && !isObstacle(neighbour)) {
        markVisited(neighbour);
        if (isNormalNode(neighbour)) {
          changeCellColor(neighbour.x, neighbour.y, "#fc7703");
        }
        neighbour.parent = nodeId;
        if (isTarget(neighbour)) {
          traceBack(neighbour);
          notFound = false;
        }
        queue.queue(neighbourId)
      }
    }
    if (node.y != grid.height && notFound) {
      neighbour = grid.cells[node.y][node.x - 1];
      neighbourId = neighbour.y + "." + neighbour.x;
      if (!neighbour.visited && !isObstacle(neighbour)) {
        markVisited(neighbour);
        if (isNormalNode(neighbour)) {
          changeCellColor(neighbour.x, neighbour.y, "#fc7703");
        }
        neighbour.parent = nodeId;
        if (isTarget(neighbour)) {
          traceBack(neighbour);
          notFound = false;

        }
        queue.queue(neighbourId)
      }
    }


  return [queue, notFound];
}
function bestFirstSearch() {

  canSelectCell = false;
  disableReset();
  disableAlgButtons();

  // This comparator prioritizes nodes closer to target
  // Uses PriorityQueue from adamhooper
  var queue = new PriorityQueue({ comparator: function (a, b) { return distanceToTarget(a) - distanceToTarget(b); } });

  var sourceNodeId = grid.origin;
  var notFound = true;

  markVisited(getNodeFromId(sourceNodeId));
  queue.queue(sourceNodeId);


  //setInterval instead of while to allow for animations
  var bestfsInterval = setInterval(function () {
    if (!notFound || queue.length == 0) {
      clearInterval(bestfsInterval);
      enableResetBtn();

    } else {
      var res = bestfsStep(queue, notFound);

      queue = res[0];
      notFound = res[1];

    }

  }, stepDur);
}
//Best-First-Search End

// Initialize Grid
initGrid(5, 5);
setOrigin(1, 1);
setTarget(5, 5);

//////////////////////////////////////////////
// Page Related JS

//Collapsible
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}
// \Collapsible


// Grid Functionality
//Getcell cellType
function getCurrentCellType(li) {
  var item = document.querySelector(".activeCellType");
  item.classList.remove("activeCellType")
  li.classList.add("activeCellType")

  if (document.getElementById("liOrigin") == li) {
    count = 0;
  } else if (document.getElementById("liTarget") == li) {
    count = 1;
  } else if (document.getElementById("liObstacle") == li) {
    count = 2;
  }

}

function disableAlgButtons() {
  var btnBFS = document.getElementById("bfsButton");
  var btnDFS = document.getElementById("dfsButton");
  var btnBestFS = document.getElementById("bestfsButton");

  btnBestFS.disabled = true;
  btnDFS.disabled = true;
  btnBFS.disabled = true;
}

function enableAlgButtons() {
  var btnBFS = document.getElementById("bfsButton");
  var btnDFS = document.getElementById("dfsButton");
  var btnBestFS = document.getElementById("bestfsButton");

  btnBestFS.disabled = false;
  btnDFS.disabled = false;
  btnBFS.disabled = false;
}

function enableResetBtn() {
  var btn = document.getElementById("resetButton");
  btn.disabled = false;
}

function disableReset() {
  var btn = document.getElementById("resetButton");
  btn.disabled = true;
}