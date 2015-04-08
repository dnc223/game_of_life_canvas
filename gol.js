var canvas = document.getElementById('mycanvas');

function getPosition(event) {
  var x = event.x;
  var y = event.y;

  var canvas = document.getElementById("mycanvas");

  x -= canvas.offsetLeft;
  y -= canvas.offsetTop;

  alert("x:" + x + " y:" + y);
}

var context = canvas.getContext('2d');

canvas.addEventListener("mousedown", getPosition, false);

context.strokeStyle = "#444";

var requestId;

var s = [];
var step;

function createRandomGrid() {
  for (var k = 0; k < 60; k++) {
    var row = new Array(60);
    for (var x = 0; x < row.length; x++) {
      row[x] = Math.floor(Math.random() * 2);
    }
    s.push(row);
  }
  step = s;
}

createRandomGrid();

function drawBlank(i, j) {
  context.beginPath();
  context.fillStyle = '#252525';
  context.rect(i*10+1, j*10+1, 9, 9);
  context.fill();
}

function drawBlankGrid() {
  for (var r = 0; r < s.length; r++) {
    for (var q = 0; q < s[r].length; q++) {
      drawBlank(r, q);
    }
  }
}
drawBlankGrid();

function drawGrid() {
  for (var i = 0; i <= 600; i += 10) {
    context.beginPath();
    context.translate(0.5, 0.5);
    context.moveTo(i, 0);
    context.lineTo(i, 600);
    context.stroke();
    context.translate(-0.5, -0.5);
  }
  for (var j = 0; j <= 600; j += 10) {
    context.beginPath();
    context.translate(0.5, 0.5);
    context.moveTo(0, j);
    context.lineTo(600, j);
    context.stroke();
    context.translate(-0.5, -0.5);
  }
}

drawGrid();

function drawCell(i, j) {
  if (step[i][j] === 0) {
    var color = "#252525";
  } else {
    var color = "#64CCC5";
  }
  context.beginPath();
  context.fillStyle = color;
  context.rect(i*10+1, j*10+1, 9, 9);
  context.fill();
}

function countNeighbors(i, j) {
  if (i == 0) {
    if (j == 0) {
      return step[i][j+1] + step[i+1][j] + step[i+1][j+1];
    } else if (j == 59) {
      return step[i][j-1] + step[i+1][j-1] + step[i+1][j];
    } else {
      return step[i][j-1] + step[i][j+1] + step[i+1][j-1] + step[i+1][j] + step[i+1][j+1];
    }
  } else if (i == 59) {
    if (j == 0) {
      return step[i-1][j] + step[i-1][j+1] + step[i][j+1];
    } else if (j == 59) {
      return step[i][j-1] + step[i-1][j] + step[i-1][j-1];
    } else {
      return step[i][j-1] + step[i][j+1] + step[i-1][j-1] + step[i-1][j] + step[i-1][j+1];
    }
  } else {
    if (j == 0) {
      return step[i-1][j] + step[i-1][j+1] + step[i][j+1] + step[i+1][j+1] + step[i+1][j];
    } else if (j == 59) {
      return step[i-1][j] + step[i-1][j-1] + step[i][j-1] + step[i+1][j-1] + step[i+1][j];
    } else {
      return step[i-1][j-1] + step[i-1][j] + step[i-1][j+1] +
             step[i][j-1] + step[i][j+1] +
             step[i+1][j-1] + step[i+1][j] + step[i+1][j+1];
    }
  }
}

var fps = 2;
var now;
var then = Date.now();
var interval = 1000/fps;
var delta;

function draw() {
  requestId = requestAnimationFrame(draw);

  now = Date.now();
  delta = now - then;

  if (delta > interval) {
    then = now - (delta % interval);
    for (var d = 0; d < 60; d++) {
      for (var e = 0; e < 60; e++) {
        drawCell(d, e);
      }
    }
    var nextStep = [];
    for (var a = 0; a < 60; a++) {
      nextStep.push([]);
    }
    for (var b = 0; b < 60; b++) {
      for (var c = 0; c < 60; c++) {
        var count = countNeighbors(b, c);
        if (step[b][c] == 1) {
          if (count < 2) {
            nextStep[b][c] = 0;
          } else if (count === 2 || count === 3) {
            nextStep[b][c] = 1;
          } else {
            nextStep[b][c] = 0;
          }
        } else {
          if (count === 3) {
            nextStep[b][c] = 1;
          } else {
            nextStep[b][c] = 0;
          }
        }
      }
    }
    step = nextStep;
  }
}

$(document).ready(function() {
  $("#stop").addClass("disabled");
  $("#clear").addClass("disabled");
  $("#start").on("click", function(e) {
    e.preventDefault();
    if (!$(this).hasClass("disabled")) {
      $(this).addClass("disabled");
      $("#clear").addClass("disabled");
      $("#stop").removeClass("disabled");
      then = Date.now();
      draw();
    }
  });
  $("#stop").on("click", function(e) {
    e.preventDefault();
    if (!$(this).hasClass("disabled")) {
      $(this).addClass("disabled");
      $("#start").removeClass("disabled");
      $("#clear").removeClass("disabled");
      if (requestId) {
        window.cancelAnimationFrame(requestId);
        requestId = undefined;
      }
    }
  });
  $("#clear").on("click", function(e) {
    e.preventDefault();
    if (!$(this).hasClass("disabled")) {
      $(this).addClass("disabled");
      drawBlankGrid();
      createRandomGrid();
    }
  });
});
