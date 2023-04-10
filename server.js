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
// app.use("/*.html", authenticate)
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

const Users = mongoose.model("Users", usersSchema);



// routes




// get routes
app.get('/', (req, res) => res.send('Hello World!'));

app.get('/get/curruser', (req, res) => {});

app.get('/get/users/all', (req, res) => {});

// get a set based on a id
app.get('/get/set/:id', (req, res) => {
    const { id } = req.params;
});

// post to change the password
app.post('/change/password', (req, res) => {
    const { password } = req.body;

});




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
        res.redirect("/home.html");
    } else {
        res.redirect("/");
    }
});

// route for signing up to the website
app.post('/signup', async (req, res) => {
    var hash = crypto.createHash('sha3-256');
    const {username, password} = req.body;
    const response = await Users.findOne({username}).exec();

    // stop if user already exists
    if (response) {
        res.redirect("/");
        return;
    }

    // add new user
    let salt = Math.floor(Math.random() * 1000000);
    let toHash = password + salt;
    let data = hash.update(toHash, 'utf-8');
    let gen_hash = data.digest('hex');
    const user = new Users({username, salt, hash: gen_hash, favorites: [], listings: []})
    user.save();
    res.redirect("/");
});










app.listen(port, () => {
    console.log(`Server is running on port http://${localhost}:${port}`);
});