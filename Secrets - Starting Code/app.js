//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

const userSchema=new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);


app.get("/", function(req , res){
    res.render("home");
});

app.get("/login", function(req , res){
    res.render("login");
});

app.get("/register", function(req , res){
    res.render("register");
});

app.post("/register", function(req, res){
    const newUser =new User({
        email: req.body.username,
        password:req.body.password
    });    
    newUser.save()
    .then(function(){
        res.render("secrets");
    })
    .catch(function(err){
        console.log(err);  
    });
});


app.post("/login" , function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username})
    .then(function(foundUser){
        if(foundUser.password=== password){
            res.render("secrets");
        }           
    })
    .catch(function(err){
        console.log(err);  
    });
})


 /*newArticle.save()
    .then(function(){
        response.send("added successfully")
    })
    .catch(function(err){
        response.send(err);
    });

    (function(err){
        console.log(err);

        (function(){
            res.render("secrets");
        });

         foundUser.password === password
            foundUser.save()
            .then(function(){
                res.render("/secrets");
            })
*/








app.listen(3000, function(){
    console.log("Server is running on port 3000")
});

