const cookieParser = require("cookie-parser");
const express = require("express")
const mongoose = require("mongoose")
const app = express();
const bodyParser = require("body-parser")
const multer = require('multer');
const { Hash } = require("crypto");
const upload = multer({dest: __dirname + '/images'});
const crypto = require('crypto')
var hash = crypto.createHash('sha3-256');

const port = 3550;
const localhost = "127.0.0.1";

app.use(cookieParser())
app.use("/*.html", authenticate)
app.use(express.static('public_html'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoURL = 'mongodb://127.0.0.1:27017/quizzy';
mongoose.connect(mongoURL, { useNewUrlParser: true });
mongoose.connection.on("connected", () => console.log("Connected to MongoDB"))
mongoose.connection.on("error", (err) => console.log(err))

const Schema = mongoose.Schema;

const usersSchema = new Schema({
    username: String,
    salt: Number,
    hash: String,
    favorites: [mongoose.ObjectId],
    listings: [mongoose.ObjectId],
})

const users = mongoose.model("users", usersSchema);


app.post('/login', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    users.findOne()

})

app.post('/signup', (req, res, next) => {
    const {username, password} = req.body;
    var salt = Math.floor(Math.random() * 100000);
    var toHash = password + salt;
    data = hash.update(toHash, 'utf-8');
    gen_hash = data.digest('hex');
    const user = new users({username, salt, gen_hash})
    users.save();
    res.json(user)

})