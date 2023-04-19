const MASTER_URL = 'http://localhost:3000';
// This js is used to display the leaderboard for all users

function displayUser(user, ranking){
    // grab the leaderboard div
    const leaderboard = document.getElementById('leaderboard');
    const row = document.createElement('div');
    // create a div for the user
    const userDiv = document.createElement('div');
    userDiv.innerHTML = user.username;
    // create a div for user's ranking number
    const rankingDiv = document.createElement('div');
    rankingDiv.innerHTML = ranking;
    // create a div for user's score
    const scoreDiv = document.createElement('div');
    scoreDiv.innerHTML = user.points;
    // append the ranking div to the leaderboard div
    if (ranking === 1) {
        row.style.backgroundColor = 'gold';
    } else if (ranking === 2) {
        row.style.backgroundColor = 'silver';
    } else if (ranking === 3) {
        row.style.backgroundColor = 'brown';
    }
    else{
        row.style.backgroundColor = 'gray';
    }
    row.append(rankingDiv);
    // append the user div to the leaderboard div
    row.append(userDiv);
    // append the score div to the leaderboard div
    console.log(scoreDiv)
    row.append(scoreDiv);
    // append the user div to the leaderboard div
    leaderboard.append(row);
}

async function main() {
    // fetch all users from the database
    const response = await fetch(`${MASTER_URL}/get/users/all`);
    const users = await response.json();
    console.log(users);
    // sort the users by score
    users.sort((a, b) => (a.score < b.score) ? 1 : -1);
    // log sorted users
    console.log(users);
    // display each user by iterating through the array
    for (let i in users) {
        console.log(i)
        let ranking = i + 1;
        displayUser(users[i], ranking);
    }
}

main()