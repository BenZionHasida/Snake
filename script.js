
// constant HTML element
const gameContainer = document.querySelector("#catch-game-board");
const body = document.querySelector("body");
const gameHeader = document.querySelector("#catch-game-header");

// sizes of window
const windowHeight = 486;
const windowWidth = 486;

// the size of snake head (including border)
const snakeHeadSize = 27;

// the size of target
const targetSize = 10;

// initialize variables outside of their functions
let snakeHead,
  listOfLinks,
  targetX,
  targetY,
  collisionStartX,
  collisionEndX,
  collisionStartY,
  collisionEndY,
  snakeHeadWidth,
  snakeHeadHeight,
  snakeHeadX,
  snakeHeadY,
  movmentX,
  movmentY,
  targetElement,
  counter,
  downActiv,
  upActive,
  rightActive,
  leftActive,
  scoreSpan,
  playButton,
  levelInput,
  movmentSpeed,
  movmentInterval,
  speedlabel;

// create menu
function createMenu() {
  // default speed
  movmentSpeed = 300;

  //  clear the screen
  gameContainer.classList.remove("game-board");
  gameHeader.classList.remove("game-header");

  // create the HTML elements
  levelInput = document.createElement("select");
  levelInput.setAttribute("class", "level-input");
  body.appendChild(levelInput);
  //
  let easy = document.createElement("option");
  easy.setAttribute("value", "1");
  easy.innerHTML = "Slow";
  levelInput.appendChild(easy);
  //
  let medium = document.createElement("option");
  medium.setAttribute("value", "2");
  medium.innerHTML = "Medium";
  levelInput.appendChild(medium);
  //
  let hard = document.createElement("option");
  hard.setAttribute("value", "3");
  hard.innerHTML = "Fast";
  levelInput.appendChild(hard);
  // listen to user selection choice
  listenToUserSpeedChoice();
  // create 'play button'
  playButton = document.createElement("button");
  playButton.setAttribute("class", "play-button");
  body.appendChild(playButton);
  playButton.innerHTML = "Play";
  // listen to play button
  playButton.addEventListener("click", startToPlay);
}

// listen to user selection (level of speed)
function listenToUserSpeedChoice() {
  levelInput.addEventListener("change", () => {
    let userLevelChoice = levelInput.value;
    console.log(userLevelChoice);
    if (userLevelChoice == 1) {
      movmentSpeed = 300;
      console.log(movmentSpeed);
    } else if (userLevelChoice == 2) {
      movmentSpeed = 200;
    } else if (userLevelChoice == 3) {
      movmentSpeed = 100;
    }
  });
}
// start to play
function startToPlay() {
  body.removeChild(playButton);
  body.removeChild(levelInput);
  buildGameBoard();
}

// build the game
function buildGameBoard() {
  // build game board
  gameContainer.classList.add("game-board");
  gameHeader.classList.add("game-header");
  // initialize the counter
  counter = 0;
  // create terget element
  targetElement = document.createElement("span");
  targetElement.setAttribute("class", "target");
  gameContainer.appendChild(targetElement);
  // create the haed of the snake
  snakeHead = document.createElement("div");
  snakeHead.setAttribute("class", "links");
  gameContainer.appendChild(snakeHead);
  // initialize the list of snake links
  listOfLinks = [];
  listOfLinks.push(snakeHead);

  // head start position
  snakeHeadY = Math.floor(windowHeight / 2);
  snakeHeadX = Math.floor(windowWidth / 2);
  snakeHead.style.top = snakeHeadY + "px";
  snakeHead.style.left = snakeHeadX + "px";

  // initialize variables for angles of the movment
  movmentY = 0;
  movmentX = 0;
  // initialize the active variables
  downActiv = false;
  upActive = false;
  leftActive = false;
  rightActive = false;

  // create scores span
  scoreSpan = document.createElement("span");
  scoreSpan.setAttribute("class", "score");
  body.appendChild(scoreSpan);
  scoreSpan.innerHTML = "Good luck!";

  // start the game
  initializeInterval();
  startlisten();
  placeNewTarget();
}

// the interval of movment----------------------------------
function initializeInterval() {
  movmentInterval = setInterval(movement, movmentSpeed);
}

function movement() {
  snakeHeadY += movmentY;
  snakeHeadX += movmentX;
  snakeHead.style.top = limitsHeight();
  snakeHead.style.left = limitsWidth();
  // check collision and caught
  checkCollision();
  checkCaught();
  // place snake links in their location
  placeTheLinks();
}

// forcing the limits ------------------------------------
function limitsHeight() {
  if (snakeHeadY > windowHeight) {
    snakeHeadY = 0;
  }
  if (snakeHeadY < 0) {
    snakeHeadY = windowHeight;
  }
  return snakeHeadY + "px";
}
function limitsWidth() {
  if (snakeHeadX > windowWidth) {
    snakeHeadX = 0;
  }
  if (snakeHeadX < 0) {
    snakeHeadX = windowWidth;
  }
  return snakeHeadX + "px";
}

// listen and defined direction--------------------------
function startlisten() {
  document.addEventListener("keydown", (Event) => {
    if (Event.key === "ArrowUp") {
      if (!downActiv) {
        movmentY = -snakeHeadSize;
        movmentX = 0;
        collisionStartX = 0;
        collisionEndX = snakeHeadSize;
        collisionStartY = 0;
        collisionEndY = snakeHeadSize;
        upActive = true;
        rightActive = false;
        leftActive = false;
      }
    }
    if (Event.key === "ArrowDown") {
      if (!upActive) {
        movmentY = snakeHeadSize;
        movmentX = 0;
        collisionStartX = 0;
        collisionEndX = snakeHeadSize;
        collisionStartY = 0;
        collisionEndY = snakeHeadSize;
        downActiv = true;
        rightActive = false;
        leftActive = false;
      }
    }
    if (Event.key === "ArrowLeft") {
      if (!rightActive) {
        movmentY = 0;
        movmentX = -snakeHeadSize;
        collisionStartX = 0;
        collisionEndX = snakeHeadSize;
        collisionStartY = 0;
        collisionEndY = snakeHeadSize;
        leftActive = true;
        upActive = false;
        downActiv = false;
      }
    }
    if (Event.key === "ArrowRight") {
      if (!leftActive) {
        movmentY = 0;
        movmentX = snakeHeadSize;
        collisionStartX = 0;
        collisionEndX = snakeHeadSize;
        collisionStartY = 0;
        collisionEndY = snakeHeadSize;
        rightActive = true;
        upActive = false;
        downActiv = false;
      }
    }
  });
}

// place new target---------------------------
function placeNewTarget() {
  targetY = Math.floor(Math.random() * (windowHeight - targetSize));
  targetX = Math.floor(Math.random() * (windowWidth - targetSize));
  targetElement.style.width = targetSize + "px";
  targetElement.style.height = targetSize + "px";
  targetElement.style.top = targetY + "px";
  targetElement.style.left = targetX + "px";
}

// check self collision--------------------------
function checkCollision() {
  for (let link = 1; link < listOfLinks.length; link++) {
    if (
      parseInt(listOfLinks[link].style.top) === snakeHeadY &&
      parseInt(listOfLinks[link].style.left) === snakeHeadX
    ) {
      gameOver();
    }
  }
}

// check caught------------------------------
function checkCaught() {
  staertCheckX = parseInt(snakeHead.style.left) + collisionStartX;
  endCheckX = parseInt(snakeHead.style.left) + collisionEndX;
  endCheckY = parseInt(snakeHead.style.top) + collisionEndY;
  staertCheckY = parseInt(snakeHead.style.top) + collisionStartY;
  if (
    staertCheckX <= parseInt(targetElement.style.left) + targetSize &&
    endCheckX >= parseInt(targetElement.style.left) &&
    staertCheckY <= parseInt(targetElement.style.top) + targetSize &&
    endCheckY >= parseInt(targetElement.style.top)
  ) {
    updateScores();
    placeNewTarget();
    addlink();
  }
}

// place the tail according the head
function placeTheLinks() {
  let newSnakeHead = listOfLinks.pop();
  listOfLinks.unshift(newSnakeHead);
  snakeHead = listOfLinks[0];
  snakeHead.style.backgroundColor = "red";
}

// update scores
function updateScores() {
  counter++;
  scoreSpan.innerHTML = counter + " scores";
}

// add link to the tail
function addlink() {
  let div = document.createElement("div");
  div.setAttribute("class", "links");
  div.style.top = listOfLinks[listOfLinks.length - 1].style.top;
  div.style.left = listOfLinks[listOfLinks.length - 1].style.left;
  gameContainer.appendChild(div);
  listOfLinks.push(div);
  snakeHead.style.backgroundColor = "white";
}

// game over
function gameOver() {
  // clear movment interval
  clearInterval(movmentInterval);
  // clear the screen
  gameContainer.classList.remove("game-board");
  gameHeader.classList.remove("game-header");
  body.removeChild(scoreSpan);
  gameContainer.innerHTML = "";
  // create game over box (in HTML)
  let messagDiv = document.createElement("div");
  messagDiv.setAttribute("class", "message-container");
  messagDiv.innerHTML = "Game over! <br>" + counter + " scoeres";
  body.appendChild(messagDiv);
  // create play again button
  let playAgainButton = document.createElement("button");
  playAgainButton.setAttribute("class", "game-over-buttons");
  playAgainButton.innerHTML = "Play again";
  messagDiv.appendChild(playAgainButton);
  // create menu button
  let menuButton = document.createElement("button");
  menuButton.setAttribute("class", "game-over-buttons");
  menuButton.innerHTML = "Menu";
  messagDiv.appendChild(menuButton);
  // listen to buttons and link to aprropiate function
  playAgainButton.addEventListener("click", () => {
    console.log("clicked");
    body.removeChild(messagDiv);
    buildGameBoard();
  });
  menuButton.addEventListener("click", () => {
    body.removeChild(messagDiv);
    createMenu();
  });
}

// creating the menu (starting the game)
createMenu();
