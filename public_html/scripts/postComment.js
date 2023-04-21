MASTER_URL = 'http://localhost:3000';


// get the set id from the url
urlParamsD = new URLSearchParams(window.location.search);
const setId = urlParamsD.get('id');



async function main() {
    // fetch the comments from the current set
    const response = await fetch(`${MASTER_URL}/get/comments/${setId}`);
    const comments = await response.json();
    console.log(comments);
    const commentsSection = document.getElementById('commentsSection');
    commentsSection.innerHTML += `
        <div class="commentHeader">
            <h1>Comments</h1>
        </div>
    `;
    // display the comments for each comment
    for (let i in comments) {
        console.log('added comment')
        commentsSection.append(displayComments(comments[i]));
    }
}

async function postCommentD(){
    const comment = document.getElementById('newComment').value;
    console.log(comment);
    // fetch to post the comment
    await fetch(`${MASTER_URL}/comment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({comment, setId})
    })
    // reload the page
    window.location.reload();
}
const commentUpload = document.getElementById('commentUpload');
commentUpload.addEventListener('click', postCommentD);

function displayComments(comments) {
    let div = document.createElement('div');
    div.className = 'comment';
    div.innerHTML = `
            <h3 class="username">${comments.username}</h3>
            <p class="commentContent">${comments.comment}</p>
    `;
    return div;
}

main()

