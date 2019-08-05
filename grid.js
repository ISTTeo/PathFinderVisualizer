class Node {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.visited = false;
    this.parent;
  }
}

var count = 0;
var grid = {};
var table = document.getElementById("table");
var inputs = document.getElementsByClassName("gridInput");

for (i=0; i<inputs.length; i++){
   inputs[i].onchange = changeGrid;
}

function changeCellColor(x,y,color) {
  var cellId = y + "." + x ;
  var cell = document.getElementById(cellId);
  cell.style.backgroundColor = color;
}

function alreadyColored(x,y,color) {
  var cellId = y + "." + x ;
  var cell = document.getElementById(cellId);

  return cell.style.backgroundColor == color
}

function parseCell(id) {
  var res = {};
  var parsed = id.split(".").map(function(item) {
    return parseInt(item,10);
  });
  res.x = parsed[1];
  res.y = parsed[0];
  return res;
}

function initGrid(h, w) {
    count = 0;
    grid.height = h;
    grid.width = w;
    grid.origin = null;
    grid.target = null;
    grid.obstacles = [];
    grid.cells = [];

    var i,k;
    var table = "<table>";
    for (i=0; i<grid.height; i++) {
      grid.cells.push([]);
      table += "<tr>"
      for(k=0; k< grid.width; k++ ) {
        var node = new Node(k+1,i+1);
        grid.cells[i].push(node);
        //var y = i+1;
        //var x = k+1;
        var cellId = node.y+"."+node.x;
        table += "<td id='" + cellId + "' onclick = cellClick(event); ></td>";

      }
      table += "</tr>";

    }
    table += "</table>";
    document.getElementById("tableId").innerHTML = table;

}

//TODO bug when you set origin in target and then set target the origin disappears
function setOrigin(x,y) {
    var origin = new Node(x,y);
    if (grid.origin == null) {
      origin.x = x;
      origin.y = y;
      grid.origin = origin;
      changeCellColor(x,y,"green");

    } else {
      changeCellColor(grid.origin.x,grid.origin.y,"white");
      origin.x = x;
      origin.y = y;
      grid.origin = origin;
      changeCellColor(grid.origin.x,grid.origin.y,"green");

    }
}

function setTarget(x,y) {

    if (x == grid.origin.x && y == grid.origin.y ) {
      alert("Error: already origin");
      return false;
    } else {

      var target = new Node(x,y);

      if (grid.target == null) {

        target.x = x;
        target.y = y;
        grid.target = target;
        changeCellColor(x,y,"red");

      } else {
        changeCellColor(grid.target.x,grid.target.y,"white");
        target.x = x;
        target.y = y;
        grid.target = target;
        changeCellColor(grid.target.x,grid.target.y,"red");

      }
      return true;
    }

}

function removeObstacle(obstacle) {
    changeCellColor(obstacle.x,obstacle.y,"white");
    var index = grid.obstacles.findIndex(function(el) {
      return obstacle.x == el.x && obstacle.y == el.y;
    })
    grid.obstacles.splice(1,index-1);
}

function setObstacle(x,y) {
    var obstacle = {};

    if (alreadyColored(x,y,"grey")) {
      obstacle.x = x;
      obstacle.y = y;
      removeObstacle(obstacle);
    } else if (alreadyColored(x,y,"green")) {
    } else if (alreadyColored(x,y,"red")) {
    } else {
      obstacle.x = x;
      obstacle.y = y;
      grid.obstacles.push(obstacle);
      changeCellColor(obstacle.x,obstacle.y,"grey");
    }

}

function cellClick(e) {
  console.log(e);
  var id = e.target.id;

  switch(count) {
    case 0:
      var yx = parseCell(id);
      setOrigin(yx.x, yx.y, grid);
      count++;
      break;
    case 1:
      var yx = parseCell(id);
      var ok = setTarget(yx.x, yx.y, grid);
      if (ok) { count++};
      break;
    case 2:
      var yx = parseCell(id);
      setObstacle(yx.x, yx.y, grid);
      break;
  }
}

function changeGrid(el) {
  var w = inputs[1].value;
  var h = inputs[0].value;
  initGrid(h,w);
  setOrigin(1,1);
  setTarget(w,h);
}

function getNodeFromGrid(node) {
  return grid.cells[node.y - 1][node.x - 1];
}

function markVisited(node) {
  getNodeFromGrid(node).visited = true;
}

function isTarget(node) {
  return node.x == grid.target.x && node.y == grid.target.y;
}

function isOrigin(node) {
  return node.x == grid.origin.x && node.y == grid.origin.y;
}

function isNormalNode(node) {
  return !isOrigin(node) && !isTarget(node);
}

function traceBack(node) {
  var node = node.parent;

  while(!isOrigin(node)) {
    changeCellColor(node.x,node.y, "black");
    node = node.parent;

  }
}

function BFS(sourceNode) {
  var queue = [];
  queue.push(sourceNode);
  markVisited(sourceNode);

  while (queue.length != 0) {
    // Remove vertex from queue to visit its neighbours
    var node = queue.pop();
    if(!isOrigin && !isTarget) {
      console.log("normalnode"  + node.x + "." + node.y);
      changeCellColor(node.x,node.y,"#fc7703");
    }
    //neighbours
    var leftNeighbour = null;
    var topNeighbour = null;
    var rightNeighbour = null;
    var bottomNeighbour = null;

    if(node.x != 1) {
      leftNeighbour = grid.cells[node.y - 1][node.x - 2];
      if (!leftNeighbour.visited) {
        grid.cells[node.y - 1][node.x - 2].parent = node;
        queue.push(leftNeighbour);
        markVisited(leftNeighbour);
        if(isTarget(leftNeighbour)) {
          traceBack(grid.cells[node.y - 1][node.x - 2].parent);
        }

      }
    }
    if(node.y != 1) {
      topNeighbour = grid.cells[node.y - 2][node.x - 1];
      if (!topNeighbour.visited) {
        grid.cells[node.y - 2][node.x - 1].parent = node;
        queue.push(topNeighbour);
        markVisited(topNeighbour);

        if(isTarget(topNeighbour)) {
          traceBack(grid.cells[node.y - 2][node.x - 1]);
        }
      }
    }
    if(node.x != grid.width) {
      rightNeighbour = grid.cells[node.y - 1][node.x];
      if (!rightNeighbour.visited) {
        grid.cells[node.y - 1][node.x].parent = node;
        queue.push(rightNeighbour);
        markVisited(rightNeighbour);

        if(isTarget(rightNeighbour)) {
          traceBack(grid.cells[node.y - 1][node.x]);
        }
      }
    }
    if(node.y != grid.height) {
      bottomNeighbour = grid.cells[node.y][node.x - 1];
      if (!bottomNeighbour.visited) {
        grid.cells[node.y][node.x-1].parent = node;
        queue.push(bottomNeighbour);
        markVisited(bottomNeighbour);

        if(isTarget(bottomNeighbour)) {
          traceBack(grid.cells[node.y][node.x - 1]);
        }
      }
    }
  }

}


initGrid(9,9);
setOrigin(1,1);
setTarget(9,9);

// You know the edges are at the for sides of each node
//
