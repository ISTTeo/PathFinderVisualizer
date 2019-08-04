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
    grid.height = h;
    grid.width = w;
    grid.origin = null;
    grid.target = null;
    grid.obstacles = [];
    var i,k;
    var table = "<table>";
    for (i=0; i<grid.height; i++) {
      table += "<tr>"
      for(k=0; k< grid.width; k++ ) {
        var y = i+1;
        var x = k+1;
        var cellId = y+"."+x;
        table += "<td id='" + cellId + "' onclick = cellClick(event); ></td>";

      }
      table += "</tr>";

    }
    table += "</table>";
    document.getElementById("tableId").innerHTML = table;

}

function setOrigin(x,y) {
    var origin = {}
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
      var target = {}
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
  var id = e.originalTarget.id;
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
initGrid(3,3 );
setOrigin(1,1);
setTarget(3,3);
