// script for the login page
// Author: Lucas, Akbar

// MASTER_URL = 'http://localhost:3000';
MASTER_URL = 'http://167.172.150.50:3000';


// function to handle login
async function handleLoginAccount() {

    // grab the username and password
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    // do nothing if either field is empty
    if (username === '' || password === '') return;

    const response = await fetch(`${MASTER_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            },
        body: JSON.stringify({username, password})
    });
    
    // if the login is successful, redirect to the home page and do some other stuff
    if (response.status === 200){
        const currentTheme = localStorage.getItem('theme');
        localStorage.clear();
        localStorage.setItem('theme', currentTheme);

        window.location.href = './home.html';
    }
    else{
        const loginForm = document.getElementById('loginForm');
        const p = document.createElement('p')
        p.textContent = "Username or password is incorrect"
        p.style.fontSize = '15px';
        p.style.color = 'red';
        loginForm.appendChild(p)
        const myTimeout = setTimeout(() => {loginForm.removeChild(p)}, 2000);
    }
    // display theme
    theme();
}