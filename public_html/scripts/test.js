// set the master url to localhost
MASTER_URL = 'http://localhost:3000';

const urlParams = new URLSearchParams(window.location.search);
const setId = urlParams.get('id');

// global variable to store card info
let globalCards = [];
let frontTextArr = [];
let backTextArr = [];
let quizAnswers = [];

async function main() {
    // const response = await fetch(`${MASTER_URL}/get/allcards/${setId}`);
    // const cards = await response.json();
    // console.log(cards);

    // fill the global arrays with the cards
    console.log('filling global arrays');
    await fillGlobalArrays();
    console.log(frontTextArr);
    console.log(backTextArr);
    console.log(quizAnswers);


    // use the arrays to display the quiz questions
    console.log('displaying quiz questions');
    displayQuizQuestion();

}




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
        // const radioButtonTrueFalse = `
        //     <p>Choose answer</p>
        //     <div class="radioButtonTrueFalse">
                
        //         <input type="radio" id="true" name="trueFalse${i}" value="true">
        //         <label for="true">True</label>
        //         <input type="radio" id="false" name="trueFalse${i}" value="false">
        //         <label for="false">False</label>
        //     </div>
        // `;

        const radioButtonTrueFalse = `
        <p>Choose answer</p>
        <ul class="radioButtonTrueFalse">
            <li>
                <input type="radio" id="true" name="trueFalse${i}" value="true">
                <label for="true">True</label>
            </li>
            <li>
                <input type="radio" id="false" name="trueFalse${i}" value="false">
                <label for="false">False</label>
            </li>
        </ul>
        `;


        questionContainer.innerHTML += questionQuestionCards + radioButtonTrueFalse
        // add the question to the quiz container
        quizContainerForm.append(questionContainer);
        // quizContainerForm.innerHTML += ;
    }

    
    // add the quiz container to the page
    document.getElementById('contentContainer').append(quizContainerForm);



    // add mouse over event listener for the radio buttons
    const radioButtons = Array.from(document.querySelectorAll('li'));
    radioButtons.forEach(radioButton => radioButton.addEventListener('mouseover', (e) => {
        const currListItem = e.currentTarget;
        currListItem.querySelector('input').style.border = '2px solid black';
        
    }));


}

// main function
main();