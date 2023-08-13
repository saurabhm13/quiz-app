
const _question = document.getElementById('question');
const _options = document.querySelector('.quiz-options');
const _checkBtn = document.getElementById('check-answer');
const _playAgainBtn = document.getElementById('play-again');
const _passBtn = document.getElementById('pass');
const _result = document.getElementById('result');
const _downloadBtn = document.getElementById('download-scorecard');
// const _correctScore = document.getElementById('correct-score');
const _asked = document.getElementById('asked');
const _totalQuestion = document.getElementById('total-question');
const _player1Score = document.getElementById('player1Score');
const _player2Score = document.getElementById('player2Score')
const _wrapper = document.querySelector('.wrapper');
const _player1Indicator = document.querySelector('.player-1-indicator');
const _player2Indicator = document.querySelector('.player-2-indicator')

let correctAnswer = "", correctScore = askedCount = 0, totalQuestion = 10;
let player1Score = player2Score = 0;
let player1Turn = true, tieBreaker = false;

// load question from API
async function loadQuestion(){
    const APIUrl = 'https://opentdb.com/api.php?amount=1';
    const result = await fetch(`${APIUrl}`)
    const data = await result.json();
    _result.innerHTML = "";
    showQuestion(data.results[0]);
}

// event listeners
function eventListeners(){
    _checkBtn.addEventListener('click', checkAnswer);
    _playAgainBtn.addEventListener('click', restartQuiz);
    // _passBtn.addEventListener('click', loadQuestion, checkCount,);
    _passBtn.addEventListener('click', () => {
        if (player1Turn) {
            player1Turn = false;
        }else {
            player1Turn = true;
        }

        checkCount();
    });
    _downloadBtn.addEventListener('click', downloadScorecard);
}

document.addEventListener('DOMContentLoaded', function(){
    loadQuestion();
    eventListeners();
    _totalQuestion.textContent = totalQuestion;
});


// display question and options
function showQuestion(data){
    _checkBtn.disabled = false;
    correctAnswer = data.correct_answer;
    let incorrectAnswer = data.incorrect_answers;
    let optionsList = incorrectAnswer;
    optionsList.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1)), 0, correctAnswer);

    _question.innerHTML = `${data.question}`;
    _options.innerHTML = `
        ${optionsList.map((option, index) => `
            <li> ${index + 1}. <span>${option}</span> </li>
        `).join('')}
    `;
    selectOption();
}


// options selection
function selectOption(){
    _options.querySelectorAll('li').forEach(function(option){
        option.addEventListener('click', function(){
            if(_options.querySelector('.selected')){
                const activeOption = _options.querySelector('.selected');
                activeOption.classList.remove('selected');
            }
            option.classList.add('selected');
        });
    });
}

// answer checking
function checkAnswer(){
    _checkBtn.disabled = true;
    if(_options.querySelector('.selected')){
        let selectedAnswer = _options.querySelector('.selected span').textContent;
        if(selectedAnswer == HTMLDecode(correctAnswer)){
            if (player1Turn) {
                player1Score+=5;
                player1Turn = false;
            }else {
                player2Score+=5;
                player1Turn = true;
            }
            _result.innerHTML = `<p><i class = "fas fa-check"></i>Correct Answer!</p>`;
        } else {
            if (player1Turn) {
                player1Score-=2;
                player1Turn = false;
            }else {
                player2Score-=2;
                player1Turn = true;
            }
            _result.innerHTML = `<p><i class = "fas fa-times"></i>Incorrect Answer!</p> <small><b>Correct Answer: </b>${correctAnswer}</small>`;
        }
        checkCount();
    } else {
        _result.innerHTML = `<p><i class = "fas fa-question"></i>Please select an option!</p>`;
        _checkBtn.disabled = false;
    }
}

// to convert html entities into normal text of correct answer if there is any
function HTMLDecode(textString) {
    let doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
}

function checkCount(){
    askedCount++;
    setCount();

    if (askedCount >= 10 && askedCount%2 == 0) {

        if (player1Score > player2Score) {

            setTimeout(function(){
                console.log("");
            }, 5000);
    
            _result.innerHTML += `<p>Playe 1 Wins, Score: ${player1Score}.</p>`;
            _playAgainBtn.style.display = "block";
            _checkBtn.style.display = "none";
            _passBtn.style.display = "none";
            _downloadBtn.style.display = "block";

        }else if (player2Score > player1Score) {
    
            setTimeout(function(){
                console.log("");
            }, 5000);
    
            _result.innerHTML += `<p>Playe 2 Wins, Score ${player2Score}.</p>`;
            _playAgainBtn.style.display = "block";
            _checkBtn.style.display = "none";
            _passBtn.style.display = "none";
            _downloadBtn.style.display = "block";

        }else if (player1Score == player2Score) {
            
            setTimeout(function(){
                loadQuestion();
            }, 300);
            _wrapper.style.background = '#f29999';
        }

    }else {
        setTimeout(function(){
            loadQuestion();
        }, 300);
    }
}

function setCount(){
    // _totalQuestion.textContent = totalQuestion;
    if (player1Turn) {
        _player1Indicator.style.visibility = 'visible';
        _player2Indicator.style.visibility = 'hidden';
    }else {
        _player2Indicator.style.visibility = 'visible';
        _player1Indicator.style.visibility = 'hidden';
    }
    
    _player1Score.innerHTML = `<p>Score: ${player1Score}</p>`;
    _player2Score.innerHTML = `<p>Score: ${player2Score}</p>`;
    _asked.innerHTML = `<p>${askedCount}`;
}

function downloadScorecard() {
    const user1ScoreText = `Player 1 Score: ${player1Score}`;
        const user2ScoreText = `Player 2 Score: ${player2Score}`;
        const filename1 = 'player1_score_card.txt';
        const filename2 = 'player2_score_card.txt';
  
        const user1Blob = new Blob([user1ScoreText], { type: 'text/plain' });
        const user2Blob = new Blob([user2ScoreText], { type: 'text/plain' });
  
        const user1Url = URL.createObjectURL(user1Blob);
        const user2Url = URL.createObjectURL(user2Blob);
  
        const user1Link = document.createElement('a');
        const user2Link = document.createElement('a');
  
        user1Link.href = user1Url;
        user1Link.download = filename1;
        user1Link.style.display = 'none';
  
        user2Link.href = user2Url;
        user2Link.download = filename2;
        user2Link.style.display = 'none';
  
        document.body.appendChild(user1Link);
        document.body.appendChild(user2Link);
  
        user1Link.click();
        user2Link.click();
  
        document.body.removeChild(user1Link);
        document.body.removeChild(user2Link);
  
        // Clean up by revoking the URL objects
        URL.revokeObjectURL(user1Url);
        URL.revokeObjectURL(user2Url);
}


function restartQuiz(){
    player1Score = player2Score = askedCount = 0;
    _playAgainBtn.style.display = "none";
    _checkBtn.style.display = "block";
    _passBtn.style.display = "block"
    _downloadBtn.style.display = "none"
    _checkBtn.disabled = false;
    _wrapper.style.background = 'white'
    setCount();
    loadQuestion();
}