const cookieParser = require("cookie-parser");
const express = require("express")
const mongoose = require("mongoose")
const app = express();
const bodyParser = require("body-parser")
const multer = require('multer');
const { Hash } = require("crypto");
const upload = multer({dest: __dirname + '/images'});
const crypto = require('crypto')


const port = 3000;
const localhost = "127.0.0.1";

app.use(cookieParser())
app.use("/*.html", authenticate)
app.use(express.static('public_html'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// connect to mongoDB
const mongoURL = 'mongodb://127.0.0.1:27017/quizzy';
mongoose.connect(mongoURL, { useNewUrlParser: true });
mongoose.connection.on("connected", () => console.log("Connected to MongoDB"))
mongoose.connection.on("error", (err) => console.log(err))



// schemas
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    username: String,
    salt: Number,
    hash: String,
    favorites: [mongoose.ObjectId],
    listings: [mongoose.ObjectId],
})

let Users = mongoose.model("Users", usersSchema);

var sessionKeys = {};
const period = 3000000;

// authentication
function authenticate(req, res, next) {
    let c = req.cookies;
    if (c && c.login){
        let result = doesUserHaveSession(c.login.username, c.login.sessionId)
        if (result){
            next()
            return;
        }
    }
    res.redirect("/")
}

// add a session for user
function addSession(req, res) {
    const username = req.body.username;
    if (username){
        let sessionId = Math.floor(Math.random() * 10000);
        sessionKeys[username] = [sessionId, Date.now()];
        res.cookie("login", { username: username, sessionId: sessionId }, { maxAge: period });
    }
}
// check if user has a session
function doesUserHaveSession(user, sessionId) {
    let entry = sessionKeys[user];
    if (entry != undefined) {
      return entry[0] == sessionId && Date.now() - entry[1] < period;
    }
    return false;
}
// routes




// get routes
app.get('/', (req, res) => res.send('Hello World!'));

app.get('/get/curruser', (req, res) => {});

app.get('/get/users/all', (req, res) => {

});

// get a set based on a id
app.get('/get/set/:id', (req, res) => {
    const { id } = req.params;
});

// post to change the password
app.post('/change/password', (req, res) => {
    const { password } = req.body;

});

// creating a set
app.post('/create/set', (req, res) => {
    const { front, back, author, year } = req.body;   
})

// post to add a set to favorites
app.post('/add/favorite', (req, res) => {
    const { id } = req.body;
});
// searching for a set by title
app.get('/search/set/:title', (req, res) => {
    const { title } = req.params;
})
// searching for a set by author
app.get('/search/set/:author', (req, res) => {
    const { author } = req.params;
})
// searching for a set by topic
app.get('/search/set/:topic', (req, res) => {
    const { topic } = req.params;
})


// route for login in to the website
app.post('/login', async (req, res) => {
    console.log("Trying to login");
    const { username, password } = req.body;
    
    // find user with that username
    const response = await Users.findOne({username: username}).exec();
    
    // check if there is a user with that username
    if (!response) {
        res.redirect("/");
        return;
    }

    // hash the password
    var hash = crypto.createHash('sha3-256');
    var toHash = password + response.salt;
    dataa = hash.update(toHash, 'utf-8');
    hashed = dataa.digest('hex');

    // redirect to home page if password is correct
    if (hashed === response.hash){
        addSession(req, res)
        res.redirect("/home.html");
    } else {
        res.redirect("/");
    }
});

// route for signing up to the website
app.post('/signup', async (req, res) => {
    console.log("Trying to sign up");
    var hash = crypto.createHash('sha3-256');
    const {username, password} = req.body;
    console.log(username, password);
    const response = await Users.findOne({username}).exec();
    

    // stop if user already exists
    if (response) {
        console.log('USER ALREADY EXISTS');
        res.sendStatus(404);
        return;
    }
    console.log('hashing');
    // add new user
    let salt = Math.floor(Math.random() * 1000000);
    let toHash = password + salt;
    let data = hash.update(toHash, 'utf-8');
    let gen_hash = data.digest('hex');
    const user = new Users({username, salt, hash: gen_hash, favorites: [], listings: []})
    user.save();
    res.sendStatus(200);
})

app.listen(port, () => {
    console.log(`Server is running on port http://${localhost}:${port}`);
});