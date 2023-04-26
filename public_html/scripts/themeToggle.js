//  check local storage for theme
export function theme(){
    const theme = localStorage.getItem('theme');
    console.log(theme);
    if (theme === 'dark') {
        // change the theme to dark
        const allElements = document.querySelectorAll('*');
        console.log(allElements);
        for (let i in allElements) {
            console.log(allElements[i]);
            allElements[i].classList.add('dark');
        }
    }
    else{
        // change the theme to light
        const allElements = document.querySelectorAll('*');
        for (let i in allElements) {
            allElements[i].classList.remove('dark');
        }
    }
}


function good(){
    console.log('works just fine')
}


