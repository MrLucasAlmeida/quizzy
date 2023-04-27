MASTER_URL = 'http://localhost:3000';


const flashcard = document.getElementById('flashcard');
const left = document.getElementById('left');
const right = document.getElementById('right');

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

var globalCards = [];
var currIndex = 0;

// when the test button is clicked, the setId has to be attached in the url
function TestButton(){
    window.location.href = './test.html?id=' + id;
}

async function main() {
    // fetch cards from the current user
    const response = await fetch(`${MASTER_URL}/get/allcards/${id}`);
    globalCards = await response.json();

    // display the first card
    displayCard(globalCards[currIndex]);
}


function handleClickLeft() {
    console.log('clicked left');
    currIndex = (currIndex - 1 + globalCards.length) % globalCards.length;
    displayCard(globalCards[currIndex]);
}
function handleClickRight() {
    console.log('clicked right');
    currIndex = (currIndex + 1 + globalCards.length) % globalCards.length;
    displayCard(globalCards[currIndex]);
}

function displayCard(cardDoc) {
    const flashcardContainer = document.getElementById('allCardsContainer');

    // remove the 2nd element which is the flashcard
    flashcardContainer.removeChild(flashcardContainer.children[1]);

    // create a new flashcard
    const newFlashcard = `
        <div class="card">
            <div class="card__inner">
                <div class="card__face card__face--front">
                    <h2>${cardDoc.front}</h2>
                </div>
                <div class="card__face card__face--back">
                    <h2>${cardDoc.back}</h2>
                </div>
            </div>
        </div>
    `;


    // add the new flashcard to the container at position 1
    document.getElementsByClassName('left')[0].insertAdjacentHTML('afterend', newFlashcard);



    // add event listener to the card for flipping
    const card = document.querySelector(".card__inner");
    card.addEventListener("click", function (e) {
    card.classList.toggle('is-flipped');
});


    // update the span showing the current term number
    document.getElementById('currTerm').innerHTML = `${currIndex + 1} of ${globalCards.length}`;
    theme();
}





main();