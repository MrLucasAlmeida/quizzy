const MASTER_URL = 'http://localhost:3000';
// This js is used to display the leaderboard for all users

function displayUser(user, ranking){
    // grab the leaderboard div
    const leaderboard = document.getElementById('leaderboard');
    // create a div for the user
    const userDiv = document.createElement('div');
    userDiv.innerHTML = user.username;
    // create a div for user's ranking number
    const rankingDiv = document.createElement('div');
    rankingDiv.innerHTML = ranking;
    // create a div for user's score
    const scoreDiv = document.createElement('div');
    scoreDiv.innerHTML = user.score;
    // append the ranking div to the leaderboard div
    if (ranking === 1) {
        rankingDiv.style.color = 'gold';
    } else if (ranking === 2) {
        rankingDiv.style.color = 'silver';
    } else if (ranking === 3) {
        rankingDiv.style.color = 'brown';
    }
    else{
        rankingDiv.style.color = 'lightgreen';
    }
    leaderboard.append(rankingDiv);
    // append the user div to the leaderboard div
    leaderboard.append(userDiv);
    // append the score div to the leaderboard div
    leaderboard.append(scoreDiv);
}

async function main() {
    // fetch all users from the database
    const response = await fetch(`${MASTER_URL}/get/allusers`);
    const users = await response.json();
    console.log(users);
    // sort the users by score
    users.sort((a, b) => (a.score < b.score) ? 1 : -1);
    // log sorted users
    console.log(users);
    // display each user by iterating through the array
    for (let i in users) {
        displayUser(users[i], ranking);
    }
}

main()