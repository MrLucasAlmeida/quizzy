// set the master url to localhost
const MASTER_URL = 'http://localhost:3000';

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
console.log(id)

async function displayCards(){
    // fetch all cards given the set id
    const response = await fetch(`${MASTER_URL}/get/allcards/${id}`);
    globalCards = await response.json();
    console.log(globalCards);
    // print how many cards there are in the set
    console.log(globalCards.length);
    let shuffled = shuffleWords(globalCards);
    console.log(shuffled);
    // display only the front of the card
    for (let i = 0; i < shuffled.length; i++){
        displayCardBack(shuffled[i])
    }

}

// shuffle words
function shuffleWords(words) {
    const shuffled = words.slice(); 
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); 
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; 
    }
    return shuffled;
}

// function for display one card's back
function displayCardBack(cardDoc) {
    const container = document.getElementById('questions');
    container.innerHTML += `<div class="card">
    <div class="card__inner">
        <div class="card__face card__face--back">
            <h2>${cardDoc.back}</h2>
        </div>
    </div>
</div>`;
};

displayCards()