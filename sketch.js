var isClicked = [];
var square = [];
var mark = [];
var gridSize = 10;
var squareSize = 50;
var numMines = 10;
var lose = false;
var win = false;
var startTime;
var stopTime;
var remainingSquares = gridSize * gridSize;


function setup() {
  createCanvas(gridSize * squareSize + 5, gridSize * squareSize + 5);
  startTime = millis();

  for(var i = 0; i < gridSize * gridSize; i++) {
    isClicked.push(false);
    square.push(false);
    mark.push(0);
  }

  generateMines();
  calculateNeighbors();

}

function draw() {
  background(255);
  drawGrid();
  if(win && !lose) {
    drawWin();
  } else {
    checkWin();
  }
}

function drawWin() {
  fill(255);
  rect(squareSize * 2, squareSize * 3, 300, 200);
  fill(0);
  textSize(32);
  text("You won in", width/2 - 90, height/2 - 10);
  text(parseInt((stopTime - startTime) /  1000) + " seconds!", width/2 - 90, height/2 + 30);
}

function drawGrid() {
  for(var index = 0; index < square.length; index++) {
    fill(255);
    rect(getX(index) * squareSize, getY(index) * squareSize, squareSize, squareSize);
    textSize(32);
    var display = "";
    
    if(mark[index] == 1)
      display = '\u2691';
    else if(mark[index] == 2)
      display = "?"; 

    if(isClicked[index]) {
      if(square[index] == -1)
        display = '\u{1F4A3}';
      else
        display = square[index];
    } 

    if(display == '0') fill(100);
    else if(display == '1') fill(0, 0, 255);
    else if(display == '2') fill(0, 123, 0);
    else if(display == '3') fill(255, 0, 0);
    else if(display == '4') fill(0, 0, 102);
    else if(display == '5') fill(102, 0, 0);
    else if(display == '6') fill(0, 102, 102);
    else if(display == '7') fill(102, 0, 102);
    else if(display == '8') fill(102, 102, 0);
    else fill(0);
    
    text(display, getX(index) * squareSize + squareSize/4, getY(index) * squareSize + squareSize*3/4);
    
  }
}

function generateMines() {
  var mines = [];
  for(var i = 0; mines.length < numMines; i++) {
    var temp = (Math.floor(Math.random() * 100));
    var present = false;
    for(j = 0; j < mines.length; j++) {
      if(mines[j] == temp) {
        present = true;
      }
    }
    if(!present) {
      mines.push(temp);
    }
  }
  for(var i = 0; i < mines.length; i++) {
    square[mines[i]] = -1;
  }
}

function calculateNeighbors() {
  for(var index = 0; index < square.length; index++) {
    if(square[index] != -1) {
      var x = getX(index);
      var y = getY(index);
      var count = 0;

      if(x > 0 && y > 0)                        //Up Left
        if(square[getIndex(x-1, y-1)] == -1) 
          count++;  
      if(y > 0)                                 //Up
        if(square[getIndex(x, y-1)] == -1) 
          count++; 
      if(x < gridSize-1 && y > 0)                 //Up Right
        if(square[getIndex(x+1, y-1)] == -1) 
          count++; 
      if(x > 0)                                 //Left
        if(square[getIndex(x-1, y)] == -1) 
          count++; 
      if(x < gridSize-1)                          //Right
        if(square[getIndex(x+1, y)] == -1)  
          count++; 
      if(x > 0 && y < gridSize-1)                 //Down Left
        if(square[getIndex(x-1, y+1)] == -1) 
          count++;
      if(y < gridSize-1)                          //Down
        if(square[getIndex(x, y+1)] == -1) 
          count++;
      if(x < gridSize-1 && y < gridSize-1)          //Down Right
        if(square[getIndex(x+1, y+1)] == -1) 
          count++;

      square[index] = count;
    }
  }
}

function getIndex(x, y) {
  return x + y * gridSize;
}

function getX(index) {
  return index % gridSize;
}

function getY(index) {
  return parseInt(index / gridSize);
}

function checkSquare(x, y) {
  var index = getIndex(x, y);
  if(mark[index] == 0) {
    isClicked[index] = true;
    remainingSquares--;
    if(square[index] == -1) {
      lose = true;
      revealMines();
    } else if(square[index] == 0) {
        if(x > 0 && y > 0 && !isClicked[getIndex(x-1, y-1)])                //Up Left
          checkSquare(x-1, y-1); 
        if(y > 0 && !isClicked[getIndex(x, y-1)])                         //Up
          checkSquare(x, y-1);
        if(x < gridSize-1 && y > 0 && !isClicked[getIndex(x+1, y-1)])         //Up Right
          checkSquare(x+1, y-1);
        if(x > 0 && !isClicked[getIndex(x-1, y)])                         //Left
          checkSquare(x-1, y);
        if(x < gridSize-1 && !isClicked[getIndex(x+1, y)])                  //Right
          checkSquare(x+1, y);
        if(x > 0 && y < gridSize-1 && !isClicked[getIndex(x-1, y+1)])         //Down Left
          checkSquare(x-1, y+1);
        if(y < gridSize-1 && !isClicked[getIndex(x, y+1)])                  //Down
          checkSquare(x, y+1);
        if(x < gridSize-1 && y < gridSize-1 && !isClicked[getIndex(x+1, y+1)])  //Down Right
          checkSquare(x+1, y+1);
    }
  }
}

function markSquare(x, y) {
  var index = getIndex(x, y)
  if(!isClicked[index]) {
    mark[index] += 1;
    mark[index] %= 3;
  }
}

function revealMines() {
  for(var i = 0; i < square.length; i++) {
    if(square[i] == -1)
      isClicked[i] = true;
  }
}

function checkWin() {
  var count = 0;
  for(var i = 0; i < gridSize * gridSize; i++) {
    if(!isClicked[i]) {
      count++;
    }
  }
  if(count == numMines) {
    win = true;
    stopTime = millis();
  }
}

function mousePressed() {
  if(!lose && !win) {
    if(mouseX >= 0 && mouseY >= 0 && mouseX < gridSize * squareSize && mouseY < gridSize * squareSize) {
      var x = parseInt(mouseX / squareSize);
      var y = parseInt(mouseY / squareSize);
      checkSquare(x, y);
    }
  }
}

function keyPressed() {
  if(keyCode == BACKSPACE) {
    isClicked = [];
    square = [];
    mark = [];
    lose = false;
    win = false;
    remainingSquares = gridSize * gridSize;
    setup();
  }
  if(!lose && !win) {
    if(mouseX >= 0 && mouseY >= 0 && mouseX < gridSize * squareSize && mouseY < gridSize * squareSize) {
      var x = parseInt(mouseX / squareSize);
      var y = parseInt(mouseY / squareSize);
      if(key == ' ') {
        console.log("space pressed");
        markSquare(x, y);
      }
    }
  }
}
