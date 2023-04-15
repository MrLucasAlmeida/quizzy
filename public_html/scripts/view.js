const MASTER_URL = 'http://localhost:3000';


const flashcard = document.getElementById('flashcard');
const left = document.getElementById('left');
const right = document.getElementById('right');

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
console.log(id); 


// get the set from the server using the id of the set
async function getSet() {
    const response = await fetch(`${MASTER_URL}/get/set/${id}`);
    const data = await response.json();
    return data;
}

getSet().then((data) => {
    // iterate through the cards
    console.log(data)
    for (let i in data.cards) {
        // create a div for each card
        let card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h1>${data.cards[i].front}</h1>
            <p>${data.cards[i].back}</p>
        `;
        // add the card to the flashcard
        flashcard.appendChild(card);
    }
    console.log(data)
    return;
});


