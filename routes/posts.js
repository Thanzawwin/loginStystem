const express = require('express');

const Route = express.Router();


//index
Route.get('/',auth,(req,res)=>{
    res.render('index');
})

function auth (req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        // req.flash('error_msg','your are not login');
        res.redirect('/user/login');
    }
}





module.exports = Route;