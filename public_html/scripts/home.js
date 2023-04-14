
const MASTER_URL = 'http://localhost:3000';



function logout(){
    fetch('/clear/cookies', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((res) => {
        window.location.href = './index.html';
    });
}

// create a container that will hold a set
function createSetContainer(setDoc) {

    const setContainer = `
    <div class="setContainer">
        <h2>${setDoc._id}</h2>
        <p>${setDoc.title}</p>
        <p>${setDoc.topic}</p>
        <p>${setDoc.cards.length} Terms</p>
        <p>${setDoc.author}</p>
    </div>
    `;

    return setContainer;



    // const setContainer = document.createElement('div');
    // setContainer.classList.add('setContainer');
    // setContainer.id = setDoc._id;
    // const setName = document.createElement('h3');
    // setName.textContent = setDoc.name;
    // const setCount = document.createElement('p');
    // setCount.textContent = setDoc.cards.length;
    // setContainer.appendChild(setName);
    // setContainer.appendChild(setCount);
    // return setContainer;
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
        const setContainer = createSetContainer(data[i]);
        studySetContainer.innerHTML += setContainer;
    }

}

// function for adding all the sets to the page based on a search
document.getElementById('searchBar').addEventListener('keyup', handleSearch);
document.getElementById('searchIcon').addEventListener('click', handleSearch);
