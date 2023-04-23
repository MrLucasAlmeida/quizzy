const MASTER_URL = 'http://localhost:3000';

const findConversation = document.getElementById('findConversation');

var otherUser;

// when the button is clicked, the messages between two users have to displayed while fetching their conversation
findConversation.addEventListener('click', () => {
    // fetch the conversation between the current user and the user in the input
    const user = document.getElementById('userName').value;
    console.log(user)
    console.log("Being clicked")
    otherUser = user;
    panel.innerHTML = '';
    writeMessageD();
    setInterval(() => {
        displayConversation(otherUser);
    }, 1000);

    displayConversation(otherUser);

})



async function displayConversation(user)
{
    const conversationPanel = document.getElementById('conversationContainer')
    console.log('displaying conversation')
    
    fetch(`${MASTER_URL}/get/conversation/${user}`)
        .then(response => {
            if (response.status!==200){
                window.alert('You cannot message yourself!')
                return;
            }
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
            })
    
} 

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
    
}

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
}
