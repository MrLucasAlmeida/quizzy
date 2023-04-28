// script for everything having to do with the theme toggling
// Author: Lucas, Akbar


//  check local storage for theme
function theme(){
    const theme = localStorage.getItem('theme');
    const image = document.getElementById('themeImage');
    if (theme === 'dark') {
        // change the theme to dark
        try {
            image.src = './assets/lightMode.jpg';
        } catch {

        }
        
        const allElements = document.querySelectorAll('*');
        for (let i in allElements) {
            try {
                allElements[i].classList.add('dark');
            } catch {
                continue;
            }
            
        }
    }
    else{
        try {
            image.src = './assets/darkMode.jpg';
        } catch {
            
        }
        
        // change the theme to light
        const allElements = document.querySelectorAll('*');
        for (let i in allElements) {
            try {
                allElements[i].classList.remove('dark');
            } catch {
                continue;
            }
            
        }
    }
}


document.addEventListener('DOMContentLoaded', theme);

// constantly check for theme to update DOM
setInterval(theme, 1);


