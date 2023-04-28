// script for the settings page
// Author: Lucas, Akbar

// handle updating the password
async function handleNewPassword(){
    // grab the old and new password
    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;

    // check if the passwords are empty
    if (oldPassword === '' || newPassword === '') return;

    const response = await fetch('/update/password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({oldPassword, newPassword})
    })
    
    // check if the password was updated
    if (response.status === 200){
        window.location.href = '/home.html';
    }
    else{
        console.log('not good')
        const formSettings = document.getElementById('formForPassword');
        const p = document.createElement('p')
        p.textContent = "The old password is typed incorrectly"
        p.style.fontSize = '15px';
        p.style.color = 'red';
        formSettings.appendChild(p)
        const myTimeout = setTimeout(() => {formSettings.removeChild(p)}, 2000)
    }
    // display theme
    theme();
}