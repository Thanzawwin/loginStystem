const express = require('express');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const mongo = require('mongodb');

//init app
const app = express();

//mongodb
const db = require('./config/database').mongoURI;

//connect db
mongoose.connect(db,{useNewUrlParser: true})
    .then(()=> console.log('mongodb connected.....'))
    .catch((err)=> console.log('db connect fail!!!!'));

//body parser middelware
app.use(bodyParser.json({limit: '1mb'}))
app.use(bodyParser.urlencoded({
    parameterLimit:1000000,
    limit:'1mb',
    extended:true
}))
//cookie parser
app.use(cookieParser());    

//public static folder
app.use(express.static(path.join(__dirname,'public')));

//view dynamic folder
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

//session
app.use(session({
    secret:'mySecret',
    saveUninitialized: true,
    resave: true
}))

//passport init
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//global var
app.use(function(req,res,next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})

//Route
//post
const posts = require('./routes/posts');
app.use(posts);
//user
const users = require('./routes/users');
app.use('/user',users);

//server
const port = process.env.PORT || 5000;
app.listen(port ,()=> console.log(`Server is running port ${port}`));

