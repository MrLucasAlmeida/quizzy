// script for the leaderboard page
// Author: Lucas, Akbar

// const MASTER_URL = 'http://localhost:3000';
const MASTER_URL = 'http://167.172.150.50:3000';
// This js is used to display the leaderboard for all users

// add an entry to the leaderboard
function displayUser(user, ranking){
    const row = document.createElement('tr');
    console.log(ranking)
    row.innerHTML = 
    `
    <td>${ranking}</td>
    <td>${user.username}</td>
    <td>${user.points}</td>
    `
    if (ranking === 1) {
        row.style.backgroundColor = 'gold';
    } else if (ranking === 2) {
        row.style.backgroundColor = 'silver';
    }else if (ranking == 3){
        row.style.backgroundColor = 'brown';
    }
    else{
        row.style.backgroundColor = 'gray';
    }
    theme();
    return row;
    
}

async function main() {
    // fetch all users from the database
    const response = await fetch(`${MASTER_URL}/get/users/all`);
    const usersUnsorted = await response.json();
    console.log(usersUnsorted);
    // sort the users by score, from highest to lowest
    var users = usersUnsorted.sort(function (a, b) {
        return b.points - a.points;
    });
    // log sorted users
    console.log(users);
    // display each user by iterating through the array
    const leaderboard = document.getElementById('leaderboard');
    const table = document.createElement('table');
    table.innerHTML += `
        <tr>
            <th>Ranking</th>
            <th>Username</th>
            <th>Score</th>
        </tr>
    `
    leaderboard.append(table);
    for (let i in users) {
        console.log(i)
        console.log(typeof i)
        i = parseInt(i)
        let ranking = i + 1;
        table.append(displayUser(users[i], ranking));

    }
    // display the current them
    theme();
}

main()