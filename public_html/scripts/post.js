// script for the create sets page
// Author: Lucas, Akbar

// MASTER_URL = 'http://localhost:3000';
// MASTER_URL = 'http://167.172.150.50:3000';
MASTER_URL = '';
var currTermNumber = 4;

document.getElementById("removeButton").addEventListener("click", () => {
    // grab the term container
    const termContainer = document.getElementById('cardInputContainer');

    // remove the last 3 elements from the term container
    console.log('checking to remove one term');
    if (termContainer.children.length < 4) {alert('Sets need at least one term!');return;};
    console.log('removing one term');
    termContainer.removeChild(termContainer.children[termContainer.children.length - 1]);
    termContainer.removeChild(termContainer.children[termContainer.children.length - 1]);
    termContainer.removeChild(termContainer.children[termContainer.children.length - 1]);


    // decrement the term number
    currTermNumber--;
    
    // display the current theme
    theme();
})

// click for add new term input fields
document.getElementById('addButton').addEventListener('click', () => {
    // grab the term container
    const termContainer = document.getElementById('cardInputContainer');

    // create new title element
    const titleElement = document.createElement('h2');
    titleElement.innerText = `Term ${currTermNumber}:`;
    
    // create new front input and back input
    // front card element
    const frontCardElement = document.createElement('input');
    frontCardElement.setAttribute('type', 'text');
    frontCardElement.setAttribute('name', 'front');
    frontCardElement.setAttribute('class', 'frontCard');

    // back card element
    const backCardElement = document.createElement('input');
    backCardElement.setAttribute('type', 'text');
    backCardElement.setAttribute('name', 'back');
    backCardElement.setAttribute('class', 'backCard');

    // add elements to the term container
    termContainer.append(titleElement);
    termContainer.append(frontCardElement);
    termContainer.append(backCardElement);

    //scroll user to the bottom of the page not instantly
    document.getElementById('formContainer').scrollTo({top: 100000, behavior: 'smooth'});
        

    // increment the term number
    currTermNumber++;
    // display the current theme
    theme();
});


// click to create a new set
document.getElementById('createButton').addEventListener('click', async () => {
    const title = document.getElementById('titleInput').value;
    const topic = document.getElementById('topicInput').value;

    // array of all of the front card text and back card text
    const frontCardsArr = Array.from(document.getElementsByClassName('frontCard'));
    const backCardsArr = Array.from(document.getElementsByClassName('backCard'));
    const frontCardsTexts = frontCardsArr.map((card) => card.value);
    const backCardsTexts = backCardsArr.map((card) => card.value);


    // if statement to make sure that all of the fields were filled out
    // alert them with a message if not
    if (title === '' || topic === '' || frontCardsTexts.includes('') || backCardsTexts.includes('')) {
        alert('Please fill out all of the fields');
        return;
    }
    
    // first create the new set
    const response = await fetch(`${MASTER_URL}/create/set`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title,
            topic
        })
    });

    const set = await response.json();
    
    
    // create a new card for each front and back card text pair
    for (let i in frontCardsTexts) {
        const front = frontCardsTexts[i];
        const back = backCardsTexts[i];
        // console.log(front, back);


        // then create the new card
        fetch(`${MASTER_URL}/create/card`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                front,
                back,
                set
            })
        });
    }

    
    // redirect to the home page
    alert('Set created successfully, and you earned 20 points');
    window.location.href = `${MASTER_URL}/home.html`;
    theme();
});
