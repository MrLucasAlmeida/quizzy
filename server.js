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
app.use("/*.html", authenticate);
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

const cardSchema = new Schema({
    front: String,
    back: String,
    author: mongoose.ObjectId,
    set: mongoose.ObjectId,
})

let Cards = mongoose.model("Cards", cardSchema);

const setsSchema = new Schema({
    authors: [mongoose.ObjectId],
    topic: String,
    title: String,
    views: Number,
    cards: [mongoose.ObjectId],
})

let Sets = mongoose.model("Sets", setsSchema);

var sessionKeys = {};
const period = 3000000;

// authentication
function authenticate(req, res, next) {
    if (req.baseUrl === "/index.html" || req.baseUrl === "/signUp.html" || req.baseUrl === "/help.html") {
        next();
        return;
    }
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
app.get('/', (req, res, next) => {
    res.send('Hello World!')
    next();
});

// returns document of the current user logged in
app.get('/get/curruser', async (req, res) => {
    const c = req.cookies;
    const response = await Users.find({username: c.login.username}).exec();
    res.send(response);
});

// get all users
app.get('/get/users/all', async (req, res) => {
    const response = await Users.find({}).exec();
    res.send(response);
});

// get a set based on a id
app.get('/get/set/:id', async (req, res) => {
    const { id } = req.params;
    res.send('hello')
    // what is meant by id? By title or by topic?
    const response = await Sets.find({id}).exec()
    res.send(response);
});

// post to change the password
app.post('/change/password', async (req, res) => {
    const username = req.cookies.login.username;
    const { oldPassword, newPassword } = req.body;

    const response = await Users.findOne({username}).exec();
    
    // verify old password
    var hash = crypto.createHash('sha3-256');
    var toHash = oldPassword + response.salt;
    dataa = hash.update(toHash, 'utf-8');
    hashed = dataa.digest('hex');

    // stop if the old password is incorrect
    if (hashed !== response.hash) {
        console.log('incorrect password');
        res.sendStatus(404);
        return;
    }

    // hash the new password
    hash = crypto.createHash('sha3-256');
    let salt = Math.floor(Math.random() * 1000000);
    toHash = newPassword + salt;
    data = hash.update(toHash, 'utf-8');
    let gen_hash = data.digest('hex');
    Users.updateOne({username}, {salt, hash: gen_hash}).exec();
    res.sendStatus(200)

});

// creating a set
app.post('/create/card', (req, res) => {
    const { front, back, author, set } = req.body;   
    const newCard = new Cards({front, back, author, set});
    newCard.save();
    // find a set that corresponds to that card
    // and then add the card to the set
    Sets.find({id: set}).exec().then((set) => {
        set.cards.push(newCard);
        set.save();
    })
})

// post to add a set to favorites
app.post('/add/favorite', (req, res) => {
    const { id } = req.body;
    const username = req.cookies.login.username;
    Users.find({username}).exec().then((user) => {
        user.favorites.push(id);
        user.save();
    })
});
// searching for a set by title match substring
app.get('/search/set/title/:title', (req, res) => {
    const { title } = req.params;
    Sets.find({title}).exec().then((set) => {
        res.send(set);
    })
})
// searching for a set by author
app.get('/search/set/author/:author', (req, res) => {
    const { author } = req.params;
    Sets.find({author}).exec().then((set) => {
        res.send(set);
    })
})
// searching for a set by topic
app.get('/search/set/topic/:topic', (req, res) => {
    const { topic } = req.params;
    Sets.find({topic}).exec().then((set) => {
        res.send(set);
    })
})


// route for login in to the website
app.post('/login', async (req, res) => {
    console.log("Trying to login");
    const { username, password } = req.body;
    
    // find user with that username
    const response = await Users.findOne({username: username}).exec();
    
    // check if there is a user with that username
    if (!response) {
        res.sendStatus(404);
        return;
    }

    // hash the password
    var hash = crypto.createHash('sha3-256');
    var toHash = password + response.salt;
    dataa = hash.update(toHash, 'utf-8');
    hashed = dataa.digest('hex');

    // redirect to home page if password is correct
    if (hashed === response.hash){
        addSession(req, res);
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

// route for signing up to the website
app.post('/signup', async (req, res) => {
    // hash the password
    var hash = crypto.createHash('sha3-256');
    const {username, password} = req.body;
    const response = await Users.findOne({username}).exec();
    
    // stop if user already exists
    if (response) {
        console.log('USER ALREADY EXISTS');
        res.sendStatus(404);
        return;
    }
    
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