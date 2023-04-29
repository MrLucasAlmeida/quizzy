// script for the settings page
// Author: Lucas, Akbar

// const MASTER_URL = 'http://localhost:3000';
// const MASTER_URL = 'http://167.172.150.50:3000';
MASTER_URL = '';


// handle updating the password
async function handleNewPassword(){
    // grab the old and new password
    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;

    // check if the passwords are empty
    if (oldPassword === '' || newPassword === '') return;

    const response = await fetch(`${MASTER_URL}/update/password`, {
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


function handleAvatarChange() {
    const currentTheme = localStorage.getItem('theme');
    localStorage.clear();
    localStorage.setItem('theme', currentTheme);
}