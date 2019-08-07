class Node {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.visited = false;
    this.parent;
  }
}

var canSelectCell = true;
var count = 0;
var grid = {};
var table = document.getElementById("table");
var inputs = document.getElementsByClassName("gridInput");

//Make sure grid changes when you alter an input
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
  if (canSelectCell) {
    var id = e.target.id;

    switch(count) {
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
        if (ok) { count++};
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

function changeGrid(el) {
  var w = inputs[1].value;
  var h = inputs[0].value;
  initGrid(h,w);
  setOrigin(1,1);
  setTarget(w,h);
  var btnBFS = document.getElementById("bfsButton");
  btnBFS.disabled = false;
  canSelectCell = true;
}

function getNodeFromGrid(node) {
  return grid.cells[node.y - 1][node.x - 1];
}
function getNodeFromId(id) {
  
  var res = parseCell(id);
  
  
  
  return grid.cells[res.y - 1][res.x - 1];
  
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

function isObstacle(node) {
  var index = grid.obstacles.findIndex(function(el) {
    return node.x == el.x && node.y == el.y;
  })
  return index != -1;
}

function isNormalNode(node) {
  return !isOrigin(node) && !isTarget(node) && !isObstacle(node);
}

function traceBack(node) {  
  var parent = getNodeFromId(node.parent);
  
  while(parent.parent != undefined) {
    changeCellColor(parent.x,parent.y, "blue");
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
    console.log(node);
    
    if(isObstacle(node)) {
      console.log("IS OBSTACLE" + JSON.stringify(node));
    }
    if(isNormalNode(node)) {
      changeCellColor(node.x,node.y,"#f0ce54");
    }

    //neighbours
    var leftNeighbour = null;
    var topNeighbour = null;
    var rightNeighbour = null;
    var bottomNeighbour = null;

    var id = node.y + "." + node.x;
    console.log(id);
    if(node.x != 1 && notFound) {
      

      leftNeighbour = grid.cells[node.y - 1][node.x - 2];
      if (!leftNeighbour.visited && !isObstacle(leftNeighbour)) {

        grid.cells[node.y - 1][node.x - 2].parent = id;
        queue.unshift(leftNeighbour);
        markVisited(leftNeighbour);
        if(isTarget(leftNeighbour)) {
          traceBack(grid.cells[node.y - 1][node.x - 2]);
          notFound = false;
        }

        if(isNormalNode(leftNeighbour)) {
          changeCellColor(leftNeighbour.x,leftNeighbour.y,"#fc7703");
        }

      }
    }
    if(node.y != 1 && notFound) {
      topNeighbour = grid.cells[node.y - 2][node.x - 1];
      if (!topNeighbour.visited && !isObstacle(topNeighbour)) {
        grid.cells[node.y - 2][node.x - 1].parent = id;
        queue.unshift(topNeighbour);
        markVisited(topNeighbour);

        if(isTarget(topNeighbour)) {
          traceBack(grid.cells[node.y - 2][node.x - 1]);
          notFound = false;
        }

        if(isNormalNode(topNeighbour)) {
          changeCellColor(topNeighbour.x,topNeighbour.y,"#fc7703");
        }
      }
    }
    if(node.x != grid.width && notFound) {
      rightNeighbour = grid.cells[node.y - 1][node.x];
      if (!rightNeighbour.visited && !isObstacle(rightNeighbour)) {
        grid.cells[node.y - 1][node.x].parent = id;
        queue.unshift(rightNeighbour);
        markVisited(rightNeighbour);

        if(isTarget(rightNeighbour)) {
          traceBack(grid.cells[node.y - 1][node.x]);
          notFound = false;
        }

        if(isNormalNode(rightNeighbour)) {
          changeCellColor(rightNeighbour.x,rightNeighbour.y,"#fc7703");
        }
      }
    }
    if(node.y != grid.height && notFound) {
      bottomNeighbour = grid.cells[node.y][node.x - 1];
      if (!bottomNeighbour.visited && !isObstacle(bottomNeighbour)) {
        grid.cells[node.y][node.x-1].parent = id;
        queue.unshift(bottomNeighbour);
        markVisited(bottomNeighbour);

        if(isTarget(bottomNeighbour)) {
          traceBack(grid.cells[node.y][node.x - 1]);
          notFound = false;
        }

        if(isNormalNode(bottomNeighbour)) {
          changeCellColor(bottomNeighbour.x,bottomNeighbour.y,"#fc7703");
        }
      }
    }

    return [queue,notFound];
  }
}

function BFS(sourceNode) {
  var btn = document.getElementById("bfsButton");
  btn.disabled = true;
  canSelectCell = false;
  var queue = [];
  queue.unshift(sourceNode);
  markVisited(sourceNode);

  var notFound = true;

  //setInterval instead of while to allow for animations
  var bfsInterval = setInterval(function() {
    if (!notFound) {
      clearInterval(bfsInterval);
      console.log(JSON.stringify(grid));

    } else {
      var res = stepBFS(queue, notFound);
      queue = res[0];
      notFound = res[1];

    }

  }, 100);

}

// BFS -- End //

// Initialize Grid
initGrid(5,5);
setOrigin(1,1);
setTarget(5,5);


//////////////////////////////////////////////
// Page Related JS

//Collapsible
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
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


//Getcell cellType
function getCurrentCellType(li) {
  var item = document.querySelector(".activeCellType");
  item.classList.remove("activeCellType")
  li.classList.add("activeCellType")

  if(document.getElementById("liOrigin") == li) {
    count = 0;
  } else if (document.getElementById("liTarget") == li) {
    count = 1;
  } else if (document.getElementById("liObstacle") == li) {
    count = 2;
  }

}
