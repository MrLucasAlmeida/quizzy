
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

const form = document.querySelector(form)
form.addEventListener('submit', (event)=>{
    event.preventDefault();
    fetch('/signUp')
        .then(response => {
            if (response.status === 404){
                const p = document.createElement('p')
                p.textContent = "User already exists! Try another username"
                p.style.fontSize = '15px';
                p.style.color = 'red';
                signupForm.appendChild(p)
                const myTimeout = setTimeout(() => {signupForm.removeChild(p)}, 2000)
            }
        })
})