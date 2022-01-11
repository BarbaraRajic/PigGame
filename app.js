var globalScores,
  currentScore,
  activePlayer,
  gamePlaying,
  userInput,
  allowSecondDice;

allowSecondDice = false;
gamePlaying = false;

function reset() {
    globalScores = [0, 0];
    currentScore = 0;
    activePlayer = 0;

    document.getElementById("score-0").textContent = "0";
    document.getElementById("score-1").textContent = "0";
    document.getElementById("current-0").textContent = "0";
    document.getElementById("current-1").textContent = "0";
  
    document.getElementById("name-0").textContent = "Player 1";
    document.getElementById("name-1").textContent = "Player 2";

    document.querySelector(".player-0-panel").classList.remove("winner");
    document.querySelector(".player-1-panel").classList.remove("winner");
    document.querySelector(".player-0-panel").classList.remove("active");
    document.querySelector(".player-1-panel").classList.remove("active");
    document.querySelector(".player-0-panel").classList.add("active");

    removeBothDice();
};

function winningScoreInput() {
    // 1. Get user's winning score input
    userInput = document.getElementById("user-input").value;

    // 2. Check user's winning score input
    if (userInput === "" || isNaN(userInput) || userInput <= 0) {
        userInput = 100;
        document.getElementById("user-input").value = userInput;
    }
};

function changePlayer() {
  // 1. Reset current score
  resetCurrentScore();

  // 2. Remove active player
  document.querySelector(".player-" + activePlayer + "-panel").classList.remove("active");

  // 2. Change player
  activePlayer === 0 ? (activePlayer = 1) : (activePlayer = 0);

  // 4. Display new active player
  document.querySelector(".player-" + activePlayer + "-panel").classList.add("active");
};

function resetCurrentScore() {
  // 1. Set current score
  currentScore = 0;

  // 2. Display current score
  displayCurrentScore();
};

function displayCurrentScore() {
    document.getElementById("current-" + activePlayer).textContent = currentScore;
};

function sumCurrentScore(...dice) {
    for(i=0; i<dice.length; i++) {
        currentScore += dice[i];
    };
};

function removeBothDice() {
    document.querySelector(".dice-1").style.display = "none";
    document.querySelector(".dice-2").style.display = "none";
};

function displayDice(dice, diceClass) {
    var diceDOM = document.querySelector(diceClass);
    diceDOM.src = "img/dice-" + dice + ".png";
    diceDOM.style.display = "block";
};

function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
};

function newGameBtnStyle() {
  var newClass = document.getElementById("new-class").classList;

  if (gamePlaying) {
    // 1. Change button style  
    newClass.add("ion-ios-minus-outline");
    newClass.remove("ion-ios-plus-outline");

    // 2. Change button text
    document.querySelector(".new-text").textContent = "Stop game";
  } else {
    // 1. Change button style  
    newClass.add("ion-ios-plus-outline");
    newClass.remove("ion-ios-minus-outline");

    // 2. Change button text
    document.querySelector(".new-text").textContent = "New game";
  }
};

function addDiceBtnStyle() {
    var diceClass = document.getElementById("dice-class").classList;
  
    if (allowSecondDice) {
      // 1. Change button style
      diceClass.add("ion-ios-minus-outline");
      diceClass.remove("ion-ios-plus-outline");
  
      // 2. Change button text
      document.querySelector(".dice-text").textContent = "Remove dice";
  
      // 3. Change dice one position
      document.querySelector(".dice-1").style.top = "190px";
    } else {
      // 1. Change button style  
      diceClass.add("ion-ios-plus-outline");
      diceClass.remove("ion-ios-minus-outline");
      
      // 2. Change buttn text
      document.querySelector(".dice-text").textContent = "Add dice";
  
      // 3. Change dice one position
      document.querySelector(".dice-1").style.top = "250px";
    }
}

document.querySelector(".btn-new").addEventListener("click", function() {
    // 1. Start-stop the game
    gamePlaying === false ? (gamePlaying = true) : (gamePlaying = false);
  
    // 2. Change look of the new game button
    newGameBtnStyle();

    // 3. Get user's input of winning score
    if(gamePlaying) {
        winningScoreInput();
    }

    // 4. Reset values and initalaze the game
    reset();
});

document.querySelector(".btn-roll").addEventListener("click", function () {
  if (gamePlaying) {
    // 1. Roll dice one
    var diceOne = rollDice();

    // 2. Display dice one
    displayDice(diceOne, ".dice-1");

    if (allowSecondDice) {
      // 1. Roll dice two
      var diceTwo = rollDice();

      // 2. Display dice two
      displayDice(diceTwo, ".dice-2")
    }

    // 3. Update current score
    if (allowSecondDice) {
      if (diceOne === 1 || diceTwo === 1) {
        changePlayer();
      } else {
        sumCurrentScore(diceOne, diceTwo)
      }
    } else {
      if (diceOne === 1) {
        changePlayer();
      } else {
        sumCurrentScore(diceOne);
      }
    }

    // 4. Display current score
    displayCurrentScore();
  }
});

document.querySelector(".btn-hold").addEventListener("click", function () {
  if (gamePlaying) {
    // 1. Storage player's result
    globalScores[activePlayer] += currentScore;

    // 2. Display player's score
    document.getElementById("score-" + activePlayer).textContent =
      globalScores[activePlayer];

    // 3. Check if player won the game
    if (globalScores[activePlayer] >= userInput) {
      document.getElementById("name-" + activePlayer).textContent = "Winner!";

      // 3.1 Reset current score
      resetCurrentScore();

      // 3.2 Change styles
      document
        .querySelector(".player-" + activePlayer + "-panel")
        .classList.remove("active");
      document
        .querySelector(".player-" + activePlayer + "-panel")
        .classList.add("winner");
    
      // 3.3 Remove both dice  
      removeBothDice();

      // 3.4 Change state value
      gamePlaying = false;

      // 3.5 Change new game button style
      newGameBtnStyle();
    } else {
        // 3.1 Change active player
        changePlayer();
    }
  }
});

document.querySelector(".btn-add-dice").addEventListener("click", function () {
    // 1. Block Add dice button if game is playing
    if(!gamePlaying) {
        // 2. Add or remove second dice
        allowSecondDice === true ? (allowSecondDice = false) : (allowSecondDice = true)

        // 3. Change Add dice button style
        addDiceBtnStyle();
    }
});