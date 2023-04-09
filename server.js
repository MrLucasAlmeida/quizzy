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

const Users = mongoose.model("Users", usersSchema);


app.post('/login', (req, res, next) => {
    console.log("TRying to login")
    const username = req.body.username;
    const password = req.body.password;
    Users.findOne({username: username}).exec()
        .then(user =>{
            if (user){
                var hash = crypto.createHash('sha3-256');
                var toHash = password + user.salt;
                dataa = hash.update(toHash, 'utf-8');
                hashed = dataa.digest('hex');
                console.log(user.hash)
                console.log(hashed)
                if (hashed === user.hash){
                    console.log("success")
                    res.redirect("/home.html")
                }
                else{
                    console.log("incorrect password")
                }
            }
        })

})

app.post('/signup', (req, res, next) => {
    var hash = crypto.createHash('sha3-256');
    const {username, password} = req.body;
    Users.findOne({username: username}).exec()
        .then(user => {
            if (user){
                console.log("This user already exists")
            }
            else{
                var salt = Math.floor(Math.random() * 100000);
                var toHash = password + salt;
                data = hash.update(toHash, 'utf-8');
                gen_hash = data.digest('hex');
                const user = new Users({username, salt, hash: gen_hash})
                user.save();
                res.json(user)
                res.redirect("/index.html")
            }
        })
})

app.listen(port, () => {
    console.log(`Server is running on port http://${localhost}:${port}`);
});