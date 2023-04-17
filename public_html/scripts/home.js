
MASTER_URL = 'http://localhost:3000';

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

// setCont.append(newDiv);

// TEST SET ENDS HERE
//----------------------------

async function main() {
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

}








function logout(){
    localStorage.clear();
    fetch('/clear/cookies', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((res) => {
        window.location.href = '/';
    });
}
const favoriteStar = document.querySelector('.favorite-star');

favoriteStar.addEventListener('click', () => {
  favoriteStar.classList.toggle('favorited');
});

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

    return newDiv;
}

async function handleSearch(e) {
    console.log('checking for enter key');
    if (e.key !== 'Enter' && e.target.id !== 'searchIcon') return;


    console.log('handling search for sets');
    const searchKeyword = document.getElementById('searchBar').value;
    // do nothing if search is empty
    if (searchKeyword === '') return;

    console.log('handling search for sets');
    const response = await fetch(`${MASTER_URL}/search/set/keyword/${searchKeyword}`);
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
}

function handleSetClick(e) {
    console.log('handling set click');
    const setId = e.currentTarget.getElementsByClassName('setId')[0].innerText;
    window.location.href = './view.html?id=' + setId;
}

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
    // const response = [];
    console.log('handling search for sets');
    const studySetContainer = document.getElementById('studySetContainer');
    studySetContainer.innerHTML = '';

    for (let i in data) {
        let setContainer = createSetContainer(data[i]);
        setContainer.addEventListener('click', handleSetClick);
        studySetContainer.append(setContainer);
    }
}









// main function call
main();

