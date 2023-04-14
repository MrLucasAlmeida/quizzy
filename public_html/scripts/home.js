
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


    let newDiv = document.createElement('div');
    newDiv.className = 'setContainer';
    newDiv.innerHTML += `
        <h2>${setDoc._id}</h2>
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
        // add event listener for clicking on a set
        setContainer.addEventListener('click', handleSetClick);

        studySetContainer.append(setContainer);
    }

}

function handleSetClick(e) {
    console.log('handling set click');
    const setId = e.target.getElementsByTagName('h2')[0].innerText;
    console.log(setId);
    window.location.href = './view.html?id=' + setId;
}


// function for adding all the sets to the page based on a search
document.getElementById('searchBar').addEventListener('keyup', handleSearch);
document.getElementById('searchIcon').addEventListener('click', handleSearch);
