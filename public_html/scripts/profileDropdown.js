const header = document.getElementById('header');
const head = document.querySelector('head');
MASTER_URL = 'http://localhost:3000';

// get the logged in user from cookies
let loggedInUser = JSON.parse(decodeURIComponent(getCookie('login')).slice(2)).username;

function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(`${name}=`)) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}

function capitalize(string) {return string.charAt(0).toUpperCase() + string.slice(1);}

// helper function for theme button
function setThemeCode() {return localStorage.getItem('theme') === 'dark' ? 'light_mode' : 'dark_mode';}
function setThemeText() {return localStorage.getItem('theme') === 'dark' ? 'Light Mode' : 'Night Mode';}
function handleThemeBtnClick() {
    // do stuff for toggling theme
    if (localStorage.getItem('theme') === 'dark') {
        localStorage.setItem('theme', 'light');
    } else {
        localStorage.setItem('theme', 'dark');
    }
}






async function main() {

    // check if the image is already stored
    if (!localStorage.getItem('avatar')) {
        // get the avatar of the logged in user
        const response = await fetch(`${MASTER_URL}/get/curruser`);
        const data = await response.json();
        localStorage.setItem('avatar', data.avatar);
    }

    

    // update the image src
    const profilePic = document.querySelector('.profile img');
    profilePic.src = `./avatars/${localStorage.getItem('avatar')}`;
}





// adds the required google api images for the dropdown icons
head.innerHTML += `
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;600&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp" rel="stylesheet">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
`;

const newProfileDropdown = `
<div class="action">
            <div class="profile" onclick="menuToggle();">
                <img src="../avatars/avatar.png" alt="profile pic">
            </div>
    
            <div class="menu">
                <h3>
                    <div>
                        Signed in as
                    </div>
                    ${capitalize(loggedInUser)}
                    
                </h3>
                <ul>
                    <li>
                        <span class="material-icons icons-size">home</span>
                        <a href="/home.html">Home</a>
                    </li>
                    <li>
                        <span class="material-icons icons-size">account_circle</span>
                        <a href="/settings.html">My Account</a>
                    </li>
                    <li>
                        <span class="material-icons icons-size">dynamic_feed</span>
                        <a href="/mySets.html">My Sets</a>
                    </li>
                    <li>
                        <span class="material-icons icons-size">favorite</span>
                        <a href="/fav.html">Favorites</a>
                    </li>
                    <li>
                        <span class="material-icons icons-size">chat</span>
                        <a href="/chat.html">Chat</a>
                    </li>
                    <li>
                        <span class="material-icons icons-size">mode</span>
                        <a href="/post.html">Create a Set</a>
                    </li>

                    <li>
                        <span class="material-icons icons-size">${setThemeCode()}</span>
                        <a href="" onclick="handleThemeBtnClick()">${setThemeText()}</a>
                    </li>

                    <li>
                        <span class="material-icons icons-size">leaderboard</span>
                        <a href="/leaderboard.html">Leaderboard</a>
                    </li>
                    <li>
                        <span class="material-icons icons-size">logout</span>
                        <a href="/" onclick="logout();" >Logout</a>
                    </li>
                </ul>
            </div>
        </div>
`;

// add profile dropdown to the page
header.innerHTML += newProfileDropdown;



// function for toggling the menu
function menuToggle(){
    const toggleMenu = document.querySelector('.menu');
    toggleMenu.classList.toggle('active')
}

// call main function
main();