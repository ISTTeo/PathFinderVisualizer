var count = 0;
var grid = {};
var table = document.getElementById("table");

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
    for (k=0; k< grid.width; k++) {
        var row = table.insertRow(k);
        for (i=0; i< grid.height; i++) {
            var cell = row.insertCell(i);
            var y = k+1;
            var x = i+1;
            cell.id =  y+ "." + x ;
            cell.onclick = cellClick
        }
    }
    return grid;
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

function cellClick() {
  switch(count) {
    case 0:
      var yx = parseCell(this.id);
      setOrigin(yx.x, yx.y, grid);
      count++;
      break;
    case 1:
      var yx = parseCell(this.id);
      var ok = setTarget(yx.x, yx.y, grid);
      if (ok) { count++};
      break;
    case 2:
      var yx = parseCell(this.id);
      setObstacle(yx.x, yx.y, grid);
      break;
  }
}


initGrid(10,10 );
setOrigin(1,1);
setTarget(10,10);
console.log(grid);
