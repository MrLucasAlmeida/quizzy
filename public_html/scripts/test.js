// script for the test page
// Author: Lucas, Akbar


// set the master url to localhost
// MASTER_URL = 'http://localhost:3000';
// MASTER_URL = 'http://167.172.150.50:3000';
MASTER_URL = '';

// get the set id from the url
const urlParams = new URLSearchParams(window.location.search);
const setId = urlParams.get('id');

// global variable to store card info
let globalCards = [];
let frontTextArr = [];
let backTextArr = [];
let quizAnswers = [];

async function main() {
    
    // fill the global arrays with the cards
    console.log('filling global arrays');
    await fillGlobalArrays();


    // use the arrays to display the quiz questions
    console.log('displaying quiz questions');
    displayQuizQuestion();

}



// fill the global arrays with the card information
async function fillGlobalArrays() {
    // fetch all cards given the set id
    const response = await fetch(`${MASTER_URL}/get/allcards/${setId}`);
    globalCards = await response.json();
    console.log(globalCards);
    // print how many cards there are in the set
    // create card matches for questions
    for (let i in globalCards) {
        frontTextArr.push(globalCards[i].front);

        // determine if the question should be correct or not
        if (Math.random() < 0.5) {
            backTextArr.push(globalCards[i].back);
            quizAnswers.push(true);
        } else {
            // answer is incorrect
            // get a random card from the set that is not of the same index
            let randomIndex = Math.floor(Math.random() * globalCards.length);
            while (randomIndex == i) {
                randomIndex = Math.floor(Math.random() * globalCards.length);
            }

            backTextArr.push(globalCards[randomIndex].back);
            quizAnswers.push(false);
        }
    }


}

// shuffle words

// function for display one card's back
function displayQuizQuestion() {
    // create quiz element div
    const quizContainerForm = document.getElementById('quizContainerForm');
    
    for (let i in frontTextArr) {
        const questionContainer = document.createElement('div');
        questionContainer.className = 'questionContainer';
        const questionQuestionCards = `
            <h2 class="termCount" >${parseInt(i) + 1} of ${frontTextArr.length}</h2>
            <div class="quizQuestionCards">
                <div class="frontCardText">
                    <h2>
                        ${frontTextArr[i]}
                    </h2>
                </div>
                <div class="backCardText">
                    <h2>
                        ${backTextArr[i]}
                    </h2>
                </div>
                
            </div>
        `;

        const radioButtonTrueFalse = `
        <p>Choose answer</p>
        <ul class="radioButtonTrueFalse">
            <li>
                <input type="radio" id="true" name="trueFalse${i}" value="true" required>
                <label for="true">True</label>
            </li>
            <li>
                <input type="radio" id="false" name="trueFalse${i}" value="false" required>
                <label for="false">False</label>
            </li>
        </ul>
        `;


        questionContainer.innerHTML += questionQuestionCards + radioButtonTrueFalse
        // add the question to the quiz container
        quizContainerForm.append(questionContainer);
        
        
    }


    // add the quiz container to the page
    document.getElementById('contentContainer').append(quizContainerForm);

    // submit message
    const submitMessage = document.createElement('div');
    submitMessage.id = 'submitMessage';
    submitMessage.innerHTML = 'You have completed the quiz. Click submit to see your results.';
    quizContainerForm.append(submitMessage);

    // add a submit button to the form
    const submitButton = document.createElement('button');
    submitButton.id = 'submitButton';
    submitButton.type = 'submit';
    submitButton.innerHTML = 'Submit test';
    // submitButton.addEventListener('onsubmit', handleQuizSubmit);
    // submitButton.onsubmit = handleQuizSubmit;
    quizContainerForm.append(submitButton);


    // add event listener to the form
    quizContainerForm.addEventListener('submit', handleQuizSubmit);


}

async function renderAnswers(correctArr){
    // iterate through the correct array and change the background color of the radio buttons
    const radioButtons = document.getElementsByClassName('radioButtonTrueFalse');
    var points = 0;
    for (let i in correctArr) {
        if (correctArr[i]) {
            // correct answer
            radioButtons[i].innerHTML += "<span class='material-icons'>done</span>"
            console.log(radioButtons[i].lastChild)
            radioButtons[i].lastChild.style.color = 'lightgreen';
            radioButtons[i].lastChild.style.transform = 'scale(1.8)';
            radioButtons[i].lastChild.style.transition = 'transform 0.5s ease-in-out';
            radioButtons[i].lastChild.style.padding = '5px';
            points++;
        
        } else {
            // incorrect answer
            radioButtons[i].innerHTML += "<span class='material-icons'>close</span>"
            radioButtons[i].lastChild.style.color = 'red';
            radioButtons[i].lastChild.style.transform = 'scale(1.8)';
            radioButtons[i].lastChild.style.transition = 'transform 0.5s ease-in-out';
            radioButtons[i].lastChild.style.padding = '5px';
        }
    }
    window.alert(`You got ${points} out of ${correctArr.length} correct! And you earned ${points} points!`);
    // fetch 'add/points/${points}' and add the points to the user's account
    console.log(points)
    await fetch(`${MASTER_URL}/add/points`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({points: points})
    })
}

function handleQuizSubmit(e) {
    e.preventDefault();
    // verify the answers and display the results
    // calculate the score and create an array of the wrong answers

    let correctArr = [];
    let currentScore = 0;
    let quizForm = e.target;
    // find all of the radio button divs
    const radioButtonInputs = quizForm.getElementsByClassName('radioButtonTrueFalse');
    const radioBtnDivArr = Array.from(radioButtonInputs);

    // iterate through the quiz questions
    for (let i in radioBtnDivArr) {
        // get the radio button
        const radioBtns = Array.from(radioBtnDivArr[i].getElementsByTagName('input'));
        const trueBtn = radioBtns[0];
        const falseBtn = radioBtns[1];

        let correctAnswer = trueBtn.checked ? true : false;
        // check which one is correct
        correctArr.push(correctAnswer === quizAnswers[i]);

        
    }
    console.log(correctArr);
    renderAnswers(correctArr);
    // display the results
    theme();
}








// main function
main();