//  check local storage for theme
function theme(){
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        // change the theme to dark
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
// document.addEventListener('change', theme);
// document.querySelector('body').addEventListener('DOMContentLoaded', theme);
// document.querySelector('body').addEventListener('change', theme);


setInterval(theme, 1);


