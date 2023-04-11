async function handleLoginAccount() {
    console.log('trying to create account')
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    // do nothing if either field is empty
    if (username === '' || password === '') return;

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            },
        body: JSON.stringify({username, password})
    });
    // const data = JSON.stringify(response);
    // console.log(data);
    if (response.status === 200){
        window.location.href = './home.html';
    }
    else{
        const loginForm = document.getElementById('loginForm');
        const p = document.createElement('p')
        p.textContent = "Username or password is incorrect"
        p.style.fontSize = '15px';
        p.style.color = 'red';
        loginForm.appendChild(p)
        const myTimeout = setTimeout(() => {signupForm.removeChild(p)}, 2000)
    }
}