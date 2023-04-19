const cookieParser = require("cookie-parser");
const express = require("express")
const mongoose = require("mongoose");

const multer = require('multer');
const upload = multer({dest: __dirname + '/public_html/avatars'});

const { Hash } = require("crypto");
const crypto = require('crypto');


const port = 3000;

const app = express();

app.use(cookieParser())
app.use("/*.html", authenticate);
app.use(express.static('public_html'));
app.use(express.json());


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
    avatar: String,
    points: Number,
    favorites: [mongoose.ObjectId],
    listings: [mongoose.ObjectId],
})

let Users = mongoose.model("Users", usersSchema);

const cardSchema = new Schema({
    front: String,
    back: String,
    author: String,
    set: mongoose.ObjectId
})

let Cards = mongoose.model("Cards", cardSchema);

const setsSchema = new Schema({
    author: String,
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
    res.redirect("/");
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
    const response = await Users.findOne({username: c.login.username}).exec();
    res.send(response);
});

// get all users
app.get('/get/users/all', async (req, res) => {
    const response = await Users.find({}).exec();
    res.send(response);
});

// get all sets
app.get('/get/sets/all', async (req, res) => {
    const response = await Sets.find({}).exec();
    res.send(JSON.stringify(response));
});

// get a set based on a id
app.get('/get/set/:id', async (req, res) => {
    const { id } = req.params;
    const response = await Sets.findOne({_id: id}).exec();
    res.send(JSON.stringify(response));
});

app.get('/get/allcards/:id', async (req, res) => {
    const { id } = req.params;
    const response = await Cards.find({set: id}).exec();
    res.send(JSON.stringify(response));
});

// get all cards by a user
app.get('/get/cards/all', async (req, res) => {
    const user = req.cookies.login.username;
    const response = await Sets.find({author: user}).exec();
    console.log("Getting all cards by user: " + user);
    res.send(JSON.stringify(response));
});

app.get('/get/topics/all', async (req, res) => {
    const response = await Sets.find({}).exec();
    let topics = response.map((set) => set.topic);
    topics = topics.filter((topic, index) => topics.indexOf(topic) === index);
    res.send(JSON.stringify(topics));
});




// clear cookies
app.post('/clear/cookies', (req, res) => {
    res.clearCookie('login');
    res.sendStatus(200);
});

// post to change the password
app.post('/update/password', async (req, res) => {
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

// add a route that checks if the set is in user favorites, if it is, remove it, if not, add it
app.post('/update/favorites', async (req, res) => {
    console.log('updating favorites')
    const username = req.cookies.login.username;
    const setId = req.body.setId;

    // add id to favorites of user if it is not already there
    // remove id from favorites of user if it is already there




    
    // Given the user, grab the user's favorites
    const user = await Users.findOne({username}).exec();
    const favorites = user.favorites;
  
    
  
    // Given the setId, get the set
    const set = await Sets.findById(setId).exec();
    
    // Check if the set is in the favorites
    if (favorites.includes(setId)) {
      console.log('removed')
      // Remove from the favorites list
      const index = favorites.indexOf(setId);
        user.favorites.splice(index, 1);
    } else {
      console.log('added')
      // Add it to the favorites list
      user.favorites.push(setId);
    }
    
    await user.save();
    res.send('favorites updated');
  });

// get the favorites of the user
app.get('/get/favorites', async (req, res) => {
    const username = req.cookies.login.username;
    const user = await Users.findOne({username}).exec();
    console.log(user)
    const favorites = user.favorites;
    console.log(user.favorites)
    res.send(favorites);
});

app.post('/update/avatar', upload.single('newAvatar'), (req, res) => {
    const username = req.cookies.login.username;
    const fileName = req.file.filename;
    Users.updateOne({username}, {avatar: fileName}).exec();
    res.redirect('/settings.html');
});

// post to create a new set
app.post('/create/set', async (req, res) => {
    const {title, topic} = req.body;
    const author = req.cookies.login.username;
    const newSet = new Sets({title, topic, author, views: 0, cards: []});
    newSet.save();
    
    // add the set to the user's listings
    Users.updateOne({username: author}, {$push: {listings: newSet._id}}).exec();
    console.log(newSet._id.toString());

    // send the id of the new set
    res.send(JSON.stringify(newSet._id.toString()));
});

// creating a set
app.post('/create/card', async (req, res) => {
    const { front, back, set } = req.body;   
    console.log(front,back);
    const author = req.cookies.login.username;
    console.log(author);

    const newCard = new Cards({front, back, author, set});
    newCard.save();
    // find a set that corresponds to that card
    // and then add the card to the set
    Sets.updateOne({_id: set}, {$push: {cards: newCard._id}}).exec();
    res.end();
});


// post to add a set to favorites for a logged in user
app.post('/add/favorite', (req, res) => {
    const { setId } = req.body;
    const username = req.cookies.login.username;
    Users.find({username}).exec().then((user) => {
        user.favorites.push(setId);
        user.favorites = user.favorites.filter((id, index) => user.favorites.indexOf(id) === index);
        user.save();
    })
});
// searching for a set by title match substring
app.get('/search/set/title/:title', (req, res) => {
    const { title } = req.params;
    Sets.find({title}).exec().then((set) => {
        res.send(set);
    });
});
// searching for a set by author
app.get('/search/set/author/:author', (req, res) => {
    const { author } = req.params;
    Sets.find({author}).exec().then((set) => {
        res.send(set);
    });
});

// get all set documents by keyword match in title, author, front and back of cards
app.get('/search/set/keyword/:keyword', async (req, res) => {
    let resSetIds = [];
    let keyword = req.params.keyword;
    
    console.log(keyword);
    console.log('getting sets by title');
    // docs that match the keyword in the title
    const response = await Sets.find({title: {$regex: keyword, $options: 'i'}}).exec();
    
    

    resSetIds.push(...response.map((set) => set._id.toString()));
    // console.log(resSets);
    console.log('getting sets by author');
    // docs that match the keyword in the author
    const response2 = await Sets.find({author: {$regex: keyword, $options: 'i'}}).exec();
    resSetIds.push(...response2.map((set) => set._id.toString()));
    // console.log(resSets);
    

    // docs that match the keyword in the front or back of the cards
    const response3 = await Cards.find({$or: [{front: {$regex: keyword, $options: 'i'}}, {back: {$regex: req.params.keyword, $options: 'i'}}]}).exec();
    
    let setIds = response3.map((card) => card.set.toString());

    resSetIds.push(...setIds);

    // filter the resSets so there are no duplicates based on _id
    resSetIds = resSetIds.filter((currId, idx) => {
        return idx === resSetIds.indexOf(currId)});

    

    // convert the set ids to set documents
    const resSets = await Sets.find({_id: {$in: resSetIds}}).exec();
    res.send(JSON.stringify(resSets));
});


// searching for a set by topic
app.get('/search/set/topic/:topic', (req, res) => {
    const { topic } = req.params;
    // using regex to ignore case
    Sets.find({topic: {$regex: topic, $options: 'i'}}).exec().then((set) => {
        res.send(JSON.stringify(set));
    });
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
    const user = new Users({username, salt, hash: gen_hash, avatar: "avatar.png", points: 0, favorites: [], listings: []})
    user.save();
    res.sendStatus(200);
})

app.listen(port, () => console.log(`Server is running on port http://localhost:${port}`));