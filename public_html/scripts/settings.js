async function handleNewPassword(){
    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;

    if (oldPassword === '' || newPassword === '') return;

    const response = await fetch('/change/password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({oldPassword, newPassword})
    })
    if (response.status === 200){
        window.location.href = './home.html';
    }
    else{
        console.log('not good')
        const formSettings = document.getElementById('formSettings');
        const p = document.createElement('p')
        p.textContent = "The old password is typed incorrectly"
        p.style.fontSize = '15px';
        p.style.color = 'red';
        formSettings.appendChild(p)
        const myTimeout = setTimeout(() => {signupForm.removeChild(p)}, 2000)
    }
}