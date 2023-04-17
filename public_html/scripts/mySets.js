
const MASTER_URL = 'http://localhost:3000';

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
    console.log(setDoc)
    console.log(setDoc.title)
    console.log(setDoc.topic)
    console.log(setDoc.author)
    console.log(setDoc.cards)
    newDiv.innerHTML += `
        <h2 class="setId">${setDoc._id}</h2>
        <h1>${setDoc.title}</h1>
        <p>${setDoc.topic}</p>
        <p>${setDoc.cards.length} Terms</p>
        <p>${setDoc.author}</p>`;
    return newDiv;
}

async function main() {
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
}

function handleSetClick(e) {
    console.log('handling set click');
    const setId = e.currentTarget.getElementsByClassName('setId')[0].innerText;
    window.location.href = './view.html?id=' + setId;
}

main()

