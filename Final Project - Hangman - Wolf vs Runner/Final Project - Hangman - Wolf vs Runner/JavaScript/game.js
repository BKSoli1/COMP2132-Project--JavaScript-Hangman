// --------------------------------------------
// Hangman Game: Runner vs Wolf 
// --------------------------------------------

/*
    Variables
*/
var wordsList = [];            // To be loaded from JSON file
var maxWrongGuesses = 6;       // Maximum allowed mistakes

// Game state variables
var chosenWord;
var chosenHint;
var guessedLetters;
var wrongGuesses;

// DOM elements 
var wordContainer;
var hintContainer;
var keyboard;
var message;
var guessRem;
var resetBtn;
var heroImg;
var wolfImg;

/*
    Fetch words and hints from JSON, then start game
*/
function fetchWordsAndStart() 
{
    fetch("../data/words.json")
        .then(function(response) { return response.json(); })
        .then(function(data) 
        {
            wordsList = data;
            startGame();
        });
}

/*
    Pick a random word AND hint from wordsList
*/
function pickRandomWord() 
{
  var idx = Math.floor(Math.random() * wordsList.length);
  chosenWord = wordsList[idx].word.toUpperCase();
  chosenHint = wordsList[idx].hint;
}

/*
    Display the word with blanks and guessed letters
*/
function updateWordDisplay() 
{
  var html = "";
  var i;
  for (i = 0; i < chosenWord.length; i++)
  {
      var ch = chosenWord.charAt(i);
      if (guessedLetters.indexOf(ch) !== -1) 
      {
          html += ch + " ";
      } 
      else 
      {
          html += "_ ";
      }
  }
  wordContainer.innerHTML = html;
}

/*
    Display the hint below the word
*/
function updateHintDisplay()
{
  hintContainer.textContent = "Hint: " + chosenHint;
}

/*
    Display the "Guesses Remaining" counter
*/
function updateGuessRemaining()
{
  var guessesLeft = maxWrongGuesses - wrongGuesses;
  guessRem.textContent = "Guesses Remaining: " + guessesLeft;
}

/*
    Build the on-screen keyboard (A–Z)
*/
function createKeyboard() 
{
  var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  keyboard.innerHTML = "";
  var i;
  for (i = 0; i < letters.length; i++) 
  {
      var ch = letters.charAt(i);
      var btn = document.createElement("button");
      btn.className = "kb-btn";
      btn.textContent = ch;
      btn.onclick = function(evt) 
      {
          handleGuess(evt.target.textContent, evt.target);
      };
      keyboard.appendChild(btn);
    }
}

/*
  Update character positions responsively:
  - Runner: always at far right of #scene, never offscreen
  - Wolf: starts at far left, moves toward runner with each wrong guess
*/
function updateCharacterPositions() 
{
  var scene = document.getElementById("scene");
  var sceneWidth = scene.offsetWidth;
  var heroImgWidth = heroImg.offsetWidth;

  var heroPadding = 12;     // right padding
  var wolfPadding = 12;     // left padding

  // Runner always at the right edge
  var heroLeft = sceneWidth - heroImgWidth - heroPadding;

  // Wolf moves toward the runner as wrong guesses increase
  var wolfStart = wolfPadding;
  var wolfMax = heroLeft; 
  var stepSize = (wolfMax - wolfStart) / maxWrongGuesses;
  var wolfPos = wolfStart + (wrongGuesses * stepSize);

  if (wolfPos > heroLeft) wolfPos = heroLeft;

  wolfImg.style.left = wolfPos + "px";
  heroImg.style.left = heroLeft + "px";
}

/*
    Handle a guessed letter 
*/
function handleGuess(letter, btn) 
{
  btn.disabled = true;
  var correct = false;
  if (chosenWord.indexOf(letter) !== -1) 
  {
      guessedLetters.push(letter);
      correct = true;
  } 
  else 
  {
      wrongGuesses++;
  }
  updateWordDisplay();
  updateHintDisplay();
  updateGuessRemaining();
  updateCharacterPositions();
  if (correct)
  {
      checkWin();
  } 
  else 
  {
      if (wrongGuesses >= maxWrongGuesses) 
      {
          showLose();
      }
  }
}

/*
    Check for win (all letters guessed)
*/
function checkWin() 
{
  var i;
  var won = true;
  for (i = 0; i < chosenWord.length; i++) 
  {
      if (guessedLetters.indexOf(chosenWord.charAt(i)) === -1) 
      {
          won = false;
          break;
      }
  }
  if (won) 
  {
    message.innerHTML = 
    '<img src="../Images/victory.gif" alt="Win" style="width:56px;vertical-align:middle;margin-right:10px;">' +
    '<span class="big-success">You Win!</span><br>' +
    '<span class="win-detail">The Runner escaped the Wolf!</span>';

      heroImg.src = "../Images/victory.gif";
      disableKeyboard();
  }
}

/*
    Show lose state (emoji before text)
*/
function showLose() 
{
  message.innerHTML =
    '<img src="../Images/lost.gif" alt="Lost" style="width:56px;vertical-align:middle;margin-right:10px;">' +
    '<span class="big-warning">Game Over!</span><br>' +
    '<span class="lose-detail">The Wolf caught the Runner.<br>The word was: ' + chosenWord + '</span>';
    
    heroImg.src = "../Images/Dead.gif";
    disableKeyboard();
}

/*
    Disable all keyboard buttons (after win/lose)
*/
function disableKeyboard() 
{
  var btns = document.getElementsByClassName('kb-btn');
  var i;
  for (i = 0; i < btns.length; i++) 
  {
      btns[i].disabled = true;
  }
}

/*
    Reset/start a new game
*/
function startGame() 
{
  pickRandomWord();
  guessedLetters = [];
  wrongGuesses = 0;

  // Get all required DOM elements (lesson style)
  wordContainer = document.getElementById("word-container");
  hintContainer = document.getElementById("hint-container");
  keyboard = document.getElementById("keyboard");
  message = document.getElementById("message");
  guessRem = document.getElementById("guess-remaining"); 
  resetBtn = document.getElementById("reset-btn");
  heroImg = document.getElementById("hero-image");
  wolfImg = document.getElementById("wolf-image");

  // Reset runner and wolf images 
  heroImg.src = "../Images/hero.gif";
  wolfImg.src = "../Images/wolf.gif";

  updateWordDisplay();
  updateHintDisplay();      
  createKeyboard();
  message.textContent = "";
  updateGuessRemaining(); 
  updateCharacterPositions();

  resetBtn.onclick = startGame;
}

/*
    Wait for DOM, fetch JSON, then start game
*/
document.addEventListener("DOMContentLoaded", fetchWordsAndStart);
