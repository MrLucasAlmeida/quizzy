const header = document.getElementById('header');
const head = document.querySelector('head');


// adds the required google api images for the dropdown icons
head.innerHTML += `
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;600&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp" rel="stylesheet">
`;

const newProfileDropdown = `
<div class="action">
            <div class="profile" onclick="menuToggle();">
                <img src="./assets/avatar.png" alt="">
            </div>
    
            <div class="menu">
                <h3>
                    User Account
                    <div>
                        Operational Team
                    </div>
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
                        <a href="#">My Sets</a>
                    </li>
                    <li>
                        <span class="material-icons icons-size">favorite</span>
                        <a href="#">Favorites</a>
                    </li>
                    <li>
                        <span class="material-icons icons-size">mode</span>
                        <a href="/post.html">Create a Set</a>
                    </li>
                    <li>
                        <span class="material-icons icons-size">help</span>
                        <a href="/help.html">Help</a>
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

