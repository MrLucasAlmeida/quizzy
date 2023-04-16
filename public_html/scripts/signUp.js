MASTER_URL = 'http://localhost:3000';



async function handleCreateAccount() {
    console.log('trying to create account')
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;

    // do nothing if either field is empty
    if (username === '' || password === '') return;

    const response = await fetch(`${MASTER_URL}/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            },
        body: JSON.stringify({username, password})
    });
    // const data = JSON.stringify(response);
    // console.log(data);
    if (response.status === 200){
        window.location.href = '/';
    }
    else{
        const signupForm = document.getElementById('signupForm');
        const p = document.createElement('p')
        p.textContent = "User already exists! Try another username"
        p.style.fontSize = '15px';
        p.style.color = 'red';
        signupForm.appendChild(p)
        const myTimeout = setTimeout(() => {signupForm.removeChild(p)}, 2000)
    }
}

