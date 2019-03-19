const mongoose = require('mongoose');
//const validator = require('validator');
//const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const formSchema = new mongoose.Schema({
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true
    }, 
    mobileNumber:{
        type:Number
    },
    dateOfBirth:{
        type:Date
    },
    password:{
        type:String
    },
    confirmPassword:{
        type:String
    },
    tokens:[{
        token: {
            type: String,
            required: true
        }
    }]
});
//formSchema.plugin(uniqueValidator);

//! form here we are setting up a new method and can call from anywhere and due to binding we will use async function not arrow function
// methods are accesseble on "instances" and some times called instance methods
formSchema.methods.generateAuthToken = async function(){

    //!here we are calling this on a specific user and we get access to that user by using "this"
    const user = this; 
    const token = jwt.sign({email:user.email},'thisismynewcourse',{expiresIn: "1h"});
    //console.log(token);
    user.tokens = user.tokens.concat({token: token});
    await user.save();

    return token;
    

}

//! static methods are accesseble on "model" sometimes also called model methods
formSchema.statics.findByCredentials = async (email,password)=>{
    const user = await User.findOne({ email: email })
    
    if(!user){
        throw new Error('unable to login');
    }
    const isMatch = await bcrypt.compare( password, user.password);
    //console.log(isMatch);
    if(!isMatch){
        throw new Error('unable to login');
    }
    return user;
}
//here we are hashing the password just before user is getting saved.
//! we have not used arrow function because this binding plays an important role and as we know arrow function doesn't binds
formSchema.pre('save', async function(next){
    const user = this;                   //! this gives the access to the individual users who are about to be saved
    if(user.isModified('password')){
        const bcrypt = require('bcrypt');
        user.password = await bcrypt.hash(user.password,10);
        user.confirmPassword = await bcrypt.hash(user.confirmPassword,10);
    }

    next();                     //! it is called so that the request can be passed to the route handlers.
})
const User = mongoose.model('SignForm',formSchema);
module.exports = User;