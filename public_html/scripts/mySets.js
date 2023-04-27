
const MASTER_URL = 'http://localhost:3000';
var favoritesSet = [];
//----------------------------
// TEST SET STARTS HERE
// default set for testing purposes
const setCont = document.getElementById('studySetContainer');
newDiv = document.createElement('div');
newDiv.addEventListener('click', handleSetClick);
newDiv.className = 'setContainer';
newDiv.innerHTML += `
        <h2 class="setId">6439983325f3e78ff8ee6d29</h2>
        <h1>Test Title</h1>
        <p>Test Topic</p>
        <p>5 Terms</p>
        <p>Test Author</p>`;

setCont.append(newDiv);

// TEST SET ENDS HERE
//----------------------------


// create a container that will hold a set
function createSetContainer(setDoc) {
    let newDiv = document.createElement('div');
    newDiv.className = 'setContainer';
    newDiv.innerHTML += `
        <i class="favorite-star"></i>
        <h2 class="setId">${setDoc._id}</h2>
        <h1>${setDoc.title}</h1>
        <p>${setDoc.topic}</p>
        <p>${setDoc.cards.length} Terms</p>
        <p>${setDoc.author}</p>`;
    theme();
    return newDiv;
}

async function main() {
    const fav = await fetch(`${MASTER_URL}/get/favorites`);
    favoritesSet = await fav.json();
    const response = await fetch(`${MASTER_URL}/get/cards/all`);
    const data = await response.json();
    console.log(data);
    // const response = [];
    console.log('handling search for sets');
    const studySetContainer = document.getElementById('studySetContainer');
    studySetContainer.innerHTML = '';

    for (let i in data) {
        let setContainer = createSetContainer(data[i]);
        setContainer.addEventListener('click', handleSetClick);
        studySetContainer.append(setContainer);
    }
    const favoriteStar = document.querySelectorAll('.favorite-star');

    const favStarArray = Array.from(favoriteStar);
    console.log(favStarArray);
    // iterate through the favorite stars and add an event listener to each one
    favStarArray.forEach((star) => {
        const id = star.parentElement.getElementsByClassName('setId')[0].innerText;
        console.log(id);
        if (favoritesSet.includes(id)){
            star.classList.add('favorited');
        }
        star.addEventListener('click', (e) => 
    {  
        // fetch('/favorite/set' and send the set id)
        fetch("/update/favorites", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ setId: star.parentElement.getElementsByClassName('setId')[0].innerText })
        });

        e.stopPropagation();
        star.classList.toggle('favorited');});
    });
    theme();
}

function handleSetClick(e) {
    console.log('handling set click');
    const setId = e.currentTarget.getElementsByClassName('setId')[0].innerText;
    window.location.href = './view.html?id=' + setId;
    theme();
}

main()

