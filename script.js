/************************************************************* 
* Name:    Horse Course
* Authors: Quinton Yong and Connor Pickles
* Date:    January 24, 2014
* Purpose: A game where you play as a horse, avoid obstacles, 
*          and try to beat the AI horses
**************************************************************/

var image = ""; // image of the horse the user picked
var gameReset = "<div id=\"box\"></div><div id=\"times\">Times to beat: <br></div><div id=\"timer\">Your time: <br></div><div id=\"horse\"></div><div id=\"lightbox\" class=\"hidden\"><h1>PAUSED</h1><button id=\"restart\" class=\"button\" onClick=\"restartGame()\">Restart</button><button id=\"backToMenu\" class=\"button\" onClick=\"backToMenu()\">Back to Menu</button></div>"; // used to reset the contents of #course, keeping lag down
var obstacleCount = 0; // number of obstacle divs created
var playerMinutes = 0; // minutes portion of timer
var playerSeconds = 0; // seconds portion of timer
var playerMilliseconds = 0; // milliseconds portion of timer
var minutes1 = 0; // faster AI horse minutes
var minutes2 = 0; // slower AI horse minutes
var seconds1 = 0; // faster AI horse seconds
var seconds2 = 0; // slower AI horse seconds
var milliseconds1 = 0; // faster AI horse milliseconds
var milliseconds2 = 0; // slower AI horse milliseconds
var bottomX = 0; // x coord of obstacle on the bottom of the course
var difficultySpeed = 0; // how fast obstacles move
var obsSpeed = 0; // how fast obstacles spawn
var movePossible = true; // is the player allowed to move
var moveObs = true; // are obstacles supposed to be spawning
var paused = false; // is the game paused
var runTimer = true; // is the timer supposed to be running

// called on load, sets initial values
function init () {

  // starts horse in the bottom and centre of the course
  document.getElementById("horse").style.left = "134px";
  document.getElementById("horse").style.top = "854px";
  
  getTimes();
} // init

// switches the visibility of the given element
function changeVisibility (element) {
  var name = document.getElementById(element).className;
  
  if (name == "hidden") {
    document.getElementById(element).className = "visible";
  } else {
    document.getElementById(element).className = "hidden";
  } // else
} // changeVisibility

// key listener
window.addEventListener('keyup', function (e) {

  // only run if the course is visible
  if (document.getElementById("course").className == "visible") {
	var block = document.getElementById("horse");
	
	// only move if the player is allowed to
	if (movePossible == true) {
	  switch (e.keyCode) {
	    case 37: // left arrow key
	      if (parseInt(block.style.left) > 14) {
	        block.style.left = parseInt(block.style.left) - 30 + "px";
		  } // if
		  break;
	    case 39: // right arrow key
	      if (parseInt(block.style.left) < 284) {
	        block.style.left = parseInt(block.style.left) + 30 + "px";
	      } // if
		  break;
	    case 38: // up arrow key
	      if (parseInt(block.style.top) > 16) {
	        block.style.top = parseInt(block.style.top) - 30 + "px";
		  } // if
		  break;
	    case 40: // down arrow key
	      if (parseInt(block.style.top) < 840) {
	        block.style.top = parseInt(block.style.top) + 30 + "px";
		  } // if
		  break;
      } // switch
	} // if
	
    // escape key - pauses and resumes the game	
	switch (e.keyCode) {
	  case 27:
	    if (paused == false) {
		  moveObs = false;
	      runTimer = false;
		  movePossible = false;
		  paused = true;
	      changeVisibility("lightbox");
	      break;
		} else if (paused == true) {
		  moveObs = true;
	      runTimer = true;
		  movePossible = true;
		  paused = false;
	      changeVisibility("lightbox");
		  break;
		} // if
	} // switch
	
	checkWin();
  } // if
}, false);

// starts running all the functions that are on timeouts
function check () {
    createObstacle();
    checkContact();
    moveObstacles();
	timer();
} // check

// creates an obstacle
function createObstacle () {

  // only run if the course is visible and obstacles are supposed to spawn
  if (document.getElementById("course").className == "visible" && moveObs == true) {
    obstacleCount++;
	
	// makes the obstacle background 1 of 4 possible images
	var num = Math.floor(Math.random() * 4) + 1;
    
	// adds the obstacle div
    document.getElementById("course").innerHTML += "<div id=\"obstacle" + obstacleCount + "\" class=\"obstacle" + num + "\"></div>"

    document.getElementById("obstacle" + obstacleCount).style.left = getObsX();
    document.getElementById("obstacle" + obstacleCount).style.top = "14px";
  } // if
  
  setTimeout(createObstacle, obsSpeed);
} // createObstacle

// checks to see if the player has reached the end of the course
function checkWin () {
  var milliseconds = playerMilliseconds;
  var seconds = playerSeconds;
  var minutes = playerMinutes;
  var output = "";
  var place = 0;
  
  if (document.getElementById("horse").style.top == "14px") {
	alert("Finish!");
	changeVisibility("course");
	changeVisibility("results");
	
	place = getPlace(minutes, seconds, milliseconds);
	
	if (place == 1) {
	  document.getElementById("result").style.backgroundImage = "url(Images/firstPlace.png)";
	} else if (place == 2) {
	  document.getElementById("result").style.backgroundImage = "url(Images/secondPlace.png)";
	} else if (place == 3) {
	  document.getElementById("result").style.backgroundImage = "url(Images/thirdPlace.png)";
	} // if
  } // if
} // if

// places the horse with the 2 randomly created AI horse times
function getPlace (minutes, seconds, milliseconds) {
  var output = 0;
  var good1 = true;
  var good2 = true;
  var good3 = true;
  
  if (minutes < minutes1) {
    output = 1;
  } else if (minutes <= minutes1 && seconds < seconds1) {
    output = 1;
  } else if (minutes <= minutes1 && seconds <= seconds1 && milliseconds < milliseconds1) {
    output = 1;
  } else {
    output = 2;
  } // else
  
  if (minutes < minutes2) {
  
  } else if (minutes <= minutes2 && seconds < seconds2) {
  
  } else if (minutes <= minutes2 && seconds <= seconds2) {
  
  } else {
    output++;
  } // else
  
  return output;
} // getPlace

// checks to see if the player hit an obstacle
function checkContact () {
  if (document.getElementById("course").className == "visible") {
    var block = document.getElementById("horse");
    var xCoordHorse = parseInt(block.style.left);
    var yCoordHorse = parseInt(block.style.top);
  
    for (i = 1; i <= obstacleCount; i++) {
      var obstacle = document.getElementById("obstacle" + i);
      var xCoordObstacle = parseInt(obstacle.style.left);
      var yCoordObstacle = parseInt(obstacle.style.top);
  
      if (xCoordHorse == xCoordObstacle && (yCoordHorse == yCoordObstacle || (yCoordHorse + 30) == yCoordObstacle)) {
        movePossible = false;	
		moveObs = false;
		resetHorse();
        setTimeout(makeMoveTrue, 2000);	
		setTimeout(makeObsTrue, 2100);
      } // if
    } // for
  } // if
  
  setTimeout(checkContact, 1);
} // checkContact

// resets the horse to the bottom of the screen
function resetHorse () {
  var block = document.getElementById("horse");
  var x = getObsX();
  
  // makes sure the horse doesn't start on top of an obstacle
  while (parseInt(x) == bottomX) {
    x = getObsX();
  } // while
  
  block.style.left = x;
  block.style.top = "854px";
} // resetHorse

// makes "movePossible" true
function makeMoveTrue () {
  if (paused == false) {
    movePossible = true;
  } // if
} // makeMoveTrue

// makes "moveObs" true
function makeObsTrue () {
  if (paused == false) {
    moveObs = true;
  } // if
} // makeObsTrue

// moves the obstacles
function moveObstacles () {
  if (document.getElementById("course").className == "visible" && moveObs == true) {
    for (i = 1; i <= obstacleCount; i++) {
	  var obstacle = document.getElementById("obstacle" + i);
	  
	  // if the obstacle is at the bottom, save its x coord
	  if (parseInt(obstacle.style.top) == 853) {
	    bottomX = parseInt(obstacle.style.left);
	  } // if
	  
	  // if the obstacle is out of the course, make it invisible
	  if (parseInt(obstacle.style.top) >= 883) {
	    changeVisibility("obstacle" + i);
      } // if
	  
	  spawnY = parseInt(obstacle.style.top) + 30;
      obstacle.style.top = spawnY + "px";
	  
	} // for
  } // if
  
  setTimeout(moveObstacles, difficultySpeed);
} // moveObstacles

// gets a random x coord for an obstacle to spawn
function getObsX () {
  var num = Math.floor(Math.random() * 10);
  var px = 0;
  
  switch (num) {
    case 0: px = 14; break;
	case 1: px = 44; break;
	case 2: px = 74; break;
	case 3: px = 104; break;
	case 4: px = 134; break;
	case 5: px = 164; break;
	case 6: px = 194; break;
	case 7: px = 224; break;
	case 8: px = 254; break;
	case 9: px = 284; break;
  } // switch
  
  return px + "px";
} // getObsX

// gets the AI horse's times
function getTimes () {
  minutes1 = 0;
  minutes2 = 0;
  seconds1 = Math.floor(Math.random() * 25) + 5;
  seconds2 = Math.floor(Math.random() * 29) + 30;
  milliseconds1 = Math.floor(Math.random() * 99);
  milliseconds2 = Math.floor(Math.random() * 99);
  
  seconds1 = getDisplayTime(seconds1);
  seconds2 = getDisplayTime(seconds2);
  milliseconds1 = getDisplayTime(milliseconds1);
  milliseconds2 = getDisplayTime(milliseconds2);
  
  document.getElementById("times").innerHTML = "Times to beat: <br>&nbsp;&nbsp;" + minutes1 + ":" + seconds1 + "." + milliseconds1 + "<br>&nbsp;&nbsp;" + minutes2 + ":" + seconds2 + "." + milliseconds2;
} // getTimes

// gets a string to display from an int
function getDisplayTime (input) {
  var s = input + "";
  var output = "";
  
  if (s.length == 1) {
    output = "0" + input;
  } else {
    output = input + "";
  } // else
  
  return output;
} // getDisplayTime

// player timer
function timer () {
  if (document.getElementById("course").className == "visible" && runTimer == true) {
   playerMilliseconds++;
  
    if (playerMilliseconds == 100) {
      playerMilliseconds = 0;
	  playerSeconds++;
    } // if
  
    if (playerSeconds == 60) {
      playerSeconds = 0;
	  playerMinutes++;
    } // if
     
    document.getElementById("timer").innerHTML = "Your time: <br> &nbsp;&nbsp;" + playerMinutes + ":" + getDisplayTime(playerSeconds) + "." + getDisplayTime(playerMilliseconds);
  } // if
  setTimeout(timer, 10);
} // timer

// sets "difficultySpeed" and "obsSpeed"
function getDifficultySpeed (x) {
  difficultySpeed = parseInt(x);
  
  if (difficultySpeed == 200) {
    obsSpeed = 450;
  } else if (difficultySpeed == 100) {
    obsSpeed = 250;
  } else if (difficultySpeed == 50){
    obsSpeed = 150;
  } else if (difficultySpeed == 1) {
    obsSpeed = 100;
  } // if
  
  changeVisibility("chooseDifficulty");
  changeVisibility("course");
} // getDifficultySpeed

// resets the game and starts from the menu
function raceAgain() {
  changeVisibility("results");
  document.getElementById("course").innerHTML = gameReset;
  document.getElementById("horse").style.left = "134px";
  document.getElementById("horse").style.top = "854px";
  playerMilliseconds = 0;
  playerSeconds = 0;
  playerMinutes = 0;
  getTimes();
  obstacleCount = 0;
  changeVisibility("menu");
} // raceAgain

// goes back to the menu from the pause screen
function backToMenu () {
  changeVisibility("lightbox");
  changeVisibility("course");
  moveObs = true;
  runTimer = true;
  movePossible = true;
  paused = false;
  document.getElementById("course").innerHTML = gameReset;
  document.getElementById("horse").style.left = "134px";
  document.getElementById("horse").style.top = "854px";
  playerMilliseconds = 0;
  playerSeconds = 0;
  playerMinutes = 0;
  getTimes();
  obstacleCount = 0;
  changeVisibility("menu");
} // backToMenu

// restarts the current game, keeping the player's horse and difficulty level
function restartGame () {
  changeVisibility("lightbox");
  document.getElementById("course").innerHTML = gameReset;
  document.getElementById("horse").style.left = "134px";
  document.getElementById("horse").style.top = "854px";
  document.getElementById("horse").style.backgroundImage = "url(Images/" + image + ".png)";
  moveObs = true;
  runTimer = true;
  movePossible = true;
  paused = false;
  playerMilliseconds = 0;
  playerSeconds = 0;
  playerMinutes = 0;
  getTimes();
  obstacleCount = 0;
} // restartGame

// gets the appropriate horse image
function getHorse (s) {
  image = s;
  document.getElementById("horse").style.backgroundImage = "url(Images/" + image + ".png)";
  changeVisibility("chooseHorse");
  changeVisibility("chooseDifficulty");
} // getHorse