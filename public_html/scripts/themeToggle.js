//  check local storage for theme

const theme = localStorage.getItem('theme');
console.log(theme);
if (theme === 'dark') {
    // change the theme to dark
    const allElements = document.querySelectorAll('*');
    for (let i in allElements) {
        allElements[i].classList.add('dark');
    }
}


