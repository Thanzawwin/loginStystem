const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const users = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }

})

const Users = module.exports = mongoose.model('Users',users);


module.exports.createUser = function (newUser,callback){
    bcrypt.genSalt(10,function(err,salt){
        bcrypt.hash(newUser.password,salt,function(err,hash){
            newUser.password = hash;
            newUser.save(callback);
        })
    })
}

//get user
module.exports.getUserByUserName = function (username,callback){
    const query = {username};

    Users.findOne(query,callback)
}

module.exports.comparePassword = function (password,hash,callback){
    bcrypt.compare(password,hash,function(err,isMatch){
        if(err) throw err;
        callback(null,isMatch);
    })
}

module.exports.getById = function (id,callback){
    Users.findById(id,callback)
}
