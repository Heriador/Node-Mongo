const User = require('../models/User');
const passport = require('passport');
const usersCtrl = {};

usersCtrl.renderSignUpForm = (req,res) =>{
    res.render('user/signup')
}

usersCtrl.signUp = async (req,res) =>{
    const errors = [];
    const {name,email,password,confirm_password} = req.body;
    if(password != confirm_password){
        errors.push({text: 'Passwords do not match'});
        
    }
    if(password.length < 4){
        errors.push({text: 'Password must be at least 4 characters'})
    }
    if(errors.length > 0){
        res.render('user/signup',{
            errors,
            name,
            email
        });
    }
    else{
        const emailUser = await User.findOne({email});
        if(emailUser){
            req.flash('error_msg','The email is already on use.');
            res.redirect('/signup')
        }
        else{
            const newUser = new User({name,email,password});
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('succes_msg', 'Successfully registered')
            res.redirect('/signin');
        }
    }
}

usersCtrl.renderSignInForm = (req,res)=>{
    res.render('user/signin');
}

usersCtrl.signin = passport.authenticate('local',{
    failureRedirect: '/signin',
    successRedirect: '/notes',
    failureFlash: true

});

usersCtrl.logOut = (req,res) =>{
    req.logOut();
    req.flash('succes_msg', 'You are logged out now');
    res.redirect('/signin');
}

module.exports = usersCtrl;