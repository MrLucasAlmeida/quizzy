// script for the chat page
// Author: Lucas, Akbar


// const MASTER_URL = 'http://localhost:3000'
// const MASTER_URL = 'http://167.172.150.50:3000';
MASTER_URL = '';

const findConversation = document.getElementById('findConversation');

var otherUser;
// when the button is clicked, the messages between two users have to displayed while fetching their conversation
findConversation.addEventListener('click', async () => {
    // fetch the conversation between the current user and the user in the input
    // fetch the current user from the database
    var sameUser = true;
    var user = document.getElementById('userName').value;
    console.log(user)
    otherUser = user;
    const response = await fetch(`${MASTER_URL}/get/currUser`);
    const data = await response.json();
    
    let usersList = await fetch(`${MASTER_URL}/get/users/all`);
    usersList = await usersList.json();

    // checks if the user that they are trying to message exists
    var userExists = false;
    for (let i in usersList){
        if (usersList[i].username === user){
            userExists = true;
            break;
        }
    }
    if (!userExists){
        window.alert('That user does not exist!')
        return;
    }



    // grab the username from the response
    console.log(data.username)
    if (data.username === user){
        window.alert('You cannot message yourself!')
        console.log('Getting to this part')
    }
    else {
        panel.innerHTML = '';
        sameUser = false;
    }
    console.log(sameUser)
    if (sameUser){
        user = '';
    }
    else{
        writeMessageD();
        intervalId = setInterval(() => {
            displayConversation(otherUser);
        }, 1000);
        displayConversation(otherUser);
    }
    theme();
});




// Function for displaying the conversation for the pair of users
async function displayConversation(user)
{
    const conversationPanel = document.getElementById('conversationContainer')
    console.log('displaying conversation')
    
    fetch(`${MASTER_URL}/get/conversation/${user}`)
        .then(response => {
            return response.json();
        })
        .then(conversation => {
            // display the conversation
            const sortedConversation = conversation.messages.sort((a,b) => a.time - b.time)
            conversationPanel.innerHTML = '';
            for (let i in sortedConversation){
                let conversation = sortedConversation[i];
                const div = document.createElement('div');
                div.className = 'message';
                div.innerHTML = `
                    <h5 class="username">${conversation.sender}</h5>
                    <h5 class="content">${conversation.message}</h5>
                `;
                conversationPanel.appendChild(div);
            }
            // display theme
            theme();
            })
            
} 
// Function for adding the send button and the input 
// field for sending a message
async function writeMessageD(){
    console.log('writing message')
    const panel = document.getElementById('panel');
    console.log(panel)
    const chatDiv = document.createElement('div');
    chatDiv.id = 'conversationContainer';
    let newDiv = document.createElement('div');
    newDiv.className = 'newMessage';
    newDiv.innerHTML = `<input type="text" id="newMessage" placeholder="Write a message">
    <button id="sendMessage" onclick="sendMessage()">Send</button>`
    panel.appendChild(chatDiv)
    panel.appendChild(newDiv);
    console.log(panel)
    theme();
}

// Function for adding a message to the database
async function sendMessage(){

    const message = document.getElementById('newMessage').value;
    console.log(message);
    // fetch to post the message
    await fetch(`${MASTER_URL}/write/message/${otherUser}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({message})
    })
    // clear the input
    iteration = true;
    document.getElementById('newMessage').value = '';
    displayConversation(otherUser);
    // display current theme
    theme();
}
