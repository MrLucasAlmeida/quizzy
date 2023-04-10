
async function handleCreateAccount() {
    console.log('trying to create account')
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;
    const response = await fetch('/signUp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            },
        body: JSON.stringify({username, password})
    });
    // const data = JSON.stringify(response);
    // console.log(data);

    if (response.status === 404){
        const signupForm = document.getElementsByTagName('form')[0];
        console.log('USER ALREADY EXISTS');
        const p = document.createElement('p')
        p.textContent = "User already exists! Try another username"
        p.style.fontSize = '15px';
        p.style.color = 'red';
        signupForm.appendChild(p)
        const myTimeout = setTimeout(() => {signupForm.removeChild(p)}, 2000)
    }

    if (response.status === 200){
        window.location.href = '/';
    }
};