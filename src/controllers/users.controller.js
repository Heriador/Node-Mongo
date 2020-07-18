const User = require('../models/User');
const usersCtrl = {};

usersCtrl.renderSignUpForm = (req,res) =>{
    res.render('user/signup')
}

usersCtrl.signUp = async (req,res) =>{
    const {name,email,password,confirm_password} = req.body;
    if(password === confirm_password){
        const newUser = new User({name,email,password});
    }
    else{
        req.flash('warning_msg', 'Passwords do not match');
    }
    
    await newUser.save();
    res.send('signup');
}

usersCtrl.renderSignInForm = (req,res)=>{
    res.render('user/signin');
}

usersCtrl.signin = (req,res) => {
    res.send('signin');
}

usersCtrl.logOut = (req,res) =>{
    res.send('logout');
}

module.exports = usersCtrl;