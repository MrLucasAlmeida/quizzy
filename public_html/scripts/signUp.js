
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

