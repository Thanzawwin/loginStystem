const express = require('express');
// const { check, validationResult } = require('express-validator/check');
const { check, validationResult } = require('express-validator/check');
const Route = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//model
const Users = require('../models/users');



//Register
Route.get('/register',(req,res)=>{
    res.render('auth/register',{errors:false,body:false});
})


//submit
Route.post('/register',[
    check('name').not().isEmpty().withMessage('name is require'),
    check('username').not().isEmpty().withMessage('username is require'),
    check('email').isEmail().withMessage('email is not vaild'),
    check('password').not().isEmpty().isLength({min:6}).custom((value,{req})=>{
        let pass = req.body.password2;
        if(pass !== value){
            return withMessage('password not match')
        }else{
            return value;
        }

    }).withMessage('password is require')
    

],(req,res)=>{
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        
        res.render('auth/register',{
            errors:errors.array(),
            body:req.body
        });
        
    }else{
        let newUser = new Users({
            name:req.body.name,
            username:req.body.username,
            email:req.body.email,
            password:req.body.password
        })
        Users.find({},(err,users)=>{
            if(userCheck(users,req.body.username)){
                //  save user
                Users.createUser(newUser,function(err,user){
                    if(err){
                        console.log('user add error')
                    }else{
                        req.flash('success_msg','you are register can now login')
                        res.redirect('/user/login');
                    }
                })
            }else{
                req.flash('error_msg','user name is alrady !');
                res.render('auth/register',{
                    errors:false,
                    body:req.body
                });
            }
        })
       
    }
    


})
function userCheck(users,isMatch){
    if(users.length > 0){

        users.forEach(user => {
            if(user.username !== isMatch){
                return true;
            }else{
                return false;
            }
        })
    }else{
        return true;
    }
}


//Login
Route.get('/login',(req,res)=>{
    res.render('auth/login',{
        errors:false,body:false
    });
})

//configure
passport.use(new LocalStrategy(
    function(username, password, done) {
      //models
      Users.getUserByUserName(username,function(err,user){
          if(err) throw err;
          if(!user){
              return done(null,false,{message:'unknow user'})
          }
          //password
          Users.comparePassword(password,user.password,function(err,isMatch){
            if(err) throw err;
            if(isMatch){
                return done(null,user)
            }else{
                return done(null,false,{message:'invalid password'});
            }
          })
      })
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    Users.getById(id, function(err, user) {
      done(err, user);
    });
  });

//login submit
Route.post('/login',
    passport.authenticate('local',{successRedirect:'/',failureRedirect:'/user/login',failureFlash:true}),
(req,res)=>{
    res.render('/')
})

//Logout
Route.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','you logout!');
    res.redirect('/user/login');
})





module.exports = Route;