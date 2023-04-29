// script for the home page
// Author: Lucas, Akbar


// MASTER_URL = 'http://localhost:3000';
MASTER_URL = 'http://167.172.150.50:3000';
var favoritesSet = [];
//----------------------------
// TEST SET STARTS HERE
// default set for testing purposes
const setCont = document.getElementById('studySetContainer');
newDiv = document.createElement('div');
newDiv.addEventListener('click', handleSetClick);
newDiv.className = 'setContainer';
newDiv.innerHTML += `
        <i class="favorite-star"></i>
        <h2 class="setId">6439983325f3e78ff8ee6d29</h2>
        <h1>Test Title</h1>
        <p>Test Topic</p>
        <p>5 Terms</p>
        <p>Test Author</p>`;

setCont.append(newDiv);

// TEST SET ENDS HERE
//----------------------------


// theme();




async function main() {
    // get the user's favorites
    const fav = await fetch(`${MASTER_URL}/get/favorites`);
    favoritesSet = await fav.json();
    // grab all of the distinct topics and add them to the dropdown menu
    const response = await fetch(`${MASTER_URL}/get/topics/all`);
    const data = await response.json();

    // add the topics to the dropdown menu
    const topicDropdown = document.getElementById('topicDropdown');
    topicDropdown.addEventListener('change', handleMenuSelection);

    // add the default all option
    // add select a topic option
    let emptyOption = document.createElement('option');
    emptyOption.innerText= 'Select a Topic';
    emptyOption.value = 'Select a Topic';
    emptyOption.disabled = true;
    emptyOption.selected = true;
    topicDropdown.append(emptyOption);
    // add all option
    let allOption = document.createElement('option');
    allOption.innerText= 'All';
    allOption.value = 'All';
    topicDropdown.append(allOption);

    

    // add the rest of the options
    for (let i in data) {
        let newOption = document.createElement('option');
        // capitalize the first letter of each topic
        newOption.innerText= data[i].charAt(0).toUpperCase() + data[i].slice(1);
        newOption.value = data[i];
        topicDropdown.append(newOption);
    }


    // function for adding all the sets to the page based on a search
    document.getElementById('searchBar').addEventListener('keyup', handleSearch);
    document.getElementById('searchIcon').addEventListener('click', handleSearch);
    theme();
}







// function for logging out the user
function logout(){

    const currentTheme = localStorage.getItem('theme');
    console.log('saving theme ' + currentTheme);
    localStorage.clear();
    fetch('/clear/cookies', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((res) => {
        window.location.href = '/';
    });

    localStorage.setItem('theme', currentTheme);

}

// create a container that will hold a set
function createSetContainer(setDoc) {

    // set div
    let newDiv = document.createElement('div');
    newDiv.className = 'setContainer';
    newDiv.innerHTML += `
        <i class="favorite-star"></i>
        <h2 class="setId">${setDoc._id}</h2>
        <h1>${setDoc.title}</h1>
        <p>${setDoc.topic}</p>
        <p>${setDoc.cards.length} Terms</p>
        <p>${setDoc.author}</p>`;


    // add dark class if dark theme
    if (localStorage.getItem('theme') === 'dark') {newDiv.classList.add('dark');}
    return newDiv;
}

// function for handling the search for keyword
async function handleSearch(e) {

    console.log('checking for enter key');
    if (e.key !== 'Enter' && e.target.id !== 'searchIcon') return;


    console.log('handling search for sets');
    const searchKeyword = document.getElementById('searchBar').value;
    // do nothing if search is empty
    if (searchKeyword === '') return;


    // gets the favorites
    const fav = await fetch(`${MASTER_URL}/get/favorites`);
    favoritesSet = await fav.json();



    // gets sets based on keyword
    console.log('handling search for sets');
    const response = await fetch(`${MASTER_URL}/search/set/keyword/${searchKeyword}`);
    const data = await response.json();
    console.log(data);

    // const response = [];
    console.log('handling search for sets');
    const studySetContainer = document.getElementById('studySetContainer');
    studySetContainer.innerHTML = '';

    // create the set cards
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

// function for handling the click of a set
function handleSetClick(e) {
    console.log('handling set click');
    const setId = e.currentTarget.getElementsByClassName('setId')[0].innerText;
    window.location.href = './view.html?id=' + setId;
    theme();
}

// function for handling the selection of a topic
async function handleMenuSelection(e) {
    console.log('handling menu selection');
    const topic = e.target.value;

    if (topic === 'All') {
        var response = await fetch(`${MASTER_URL}/get/sets/all`);
    } else {
        var response = await fetch(`${MASTER_URL}/search/set/topic/${topic}`);
    }

    const data = await response.json();
    console.log(data);
    

    // gets the favorites
    const fav = await fetch(`${MASTER_URL}/get/favorites`);
    favoritesSet = await fav.json();


    // get the study set container
    console.log('handling search for sets');
    const studySetContainer = document.getElementById('studySetContainer');
    studySetContainer.innerHTML = '';


    // create the set cards
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
        star.addEventListener('click', (e) => {  
            // update the favorites array for the user with this new set
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

// function for handling the click of the create set button
function theme(){
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        // change the theme to dark
        const allElements = document.querySelectorAll('*');
        for (let i in allElements) {
            try {
                allElements[i].classList.add('dark');
            } catch {
                continue;
            }
            
        }
    }
    else{
        // change the theme to light
        const allElements = document.querySelectorAll('*');
        for (let i in allElements) {
            try {
                allElements[i].classList.remove('dark');
            } catch {
                continue;
            }
            
        }
    }
}







// main function call
main();

