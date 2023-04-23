const MASTER_URL = 'http://localhost:3000';

const findConversation = document.getElementById('findConversation');

var otherUser;
var iteration = false;
// when the button is clicked, the messages between two users have to displayed while fetching their conversation
findConversation.addEventListener('click', () => {
    // fetch the conversation between the current user and the user in the input
    const user = document.getElementById('userName').value;
    
    otherUser = user;
    
    displayConversation(otherUser, iteration);

})



async function displayConversation(user, iteration)
{
    const panel = document.getElementById('panel');
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
            if (iteration){
                let conversation = sortedConversation[sortedConversation.length - 1];
                const newMessage = document.getElementsByClassName('newMessage')[document.getElementsByClassName('newMessage').length - 1];

                const div = document.createElement('div');
                const input = document.getElementById('newMessage');
                const submit = document.getElementById('sendMessage');
                div.className ='message';
                div.innerHTML = `
                    <h5 class="username">${conversation.sender}</h5>
                    <h5 class="content">${conversation.message}</h5>
                `;
                console.log(newMessage)
                // remove the input and submit button and add the new message
    
                newMessage.removeChild(submit)
                newMessage.removeChild(input);
                // I tried using insert before, but didn't work
            }
            else{
                panel.innerHTML = '';
                for (let i in sortedConversation){
                    
                    let conversation = sortedConversation[i];
                    const div = document.createElement('div');
                    div.className = 'message';
                    div.innerHTML = `
                        <h5 class="username">${conversation.sender}</h5>
                        <h5 class="content">${conversation.message}</h5>
                    `;
                    panel.append(div);
                }
            }
            writeMessageD();
            
        })
        .catch(error => {
            console.log(error);
        })
    
} 

async function writeMessageD(){
    let newDiv = document.createElement('div');
    const panel = document.getElementById('panel');
    newDiv.className = 'newMessage';
    newDiv.innerHTML = `<input type="text" id="newMessage" placeholder="Write a message">
    <button id="sendMessage" onclick="sendMessage()">Send</button>`
    panel.append(newDiv)
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
    displayConversation(otherUser, iteration);
}
