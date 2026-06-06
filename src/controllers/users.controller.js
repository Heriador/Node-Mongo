import User from '../models/User.js';
import passport from 'passport';
import { catchAsync } from '../helpers/catchAsync.js';
import { successRedirect, errorRedirect } from '../helpers/flashRedirect.js';


export const renderSignUpForm = (req,res) =>{
    res.render('user/signup')
}

export const signUp = catchAsync(async (req,res) =>{
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
            errorRedirect(req, res, 'The email is already on use.', '/signup');
        }
        else{
            const newUser = new User({name,email,password});
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            successRedirect(req, res, 'Successfully registered', '/signin');
        }
    }
});

export const renderSignInForm = (req,res)=>{
    res.render('user/signin');
}

export const signIn = passport.authenticate('local',{
    failureRedirect: '/signin',
    successRedirect: '/notes',
    failureFlash: true

});

export const logOut = (req,res) =>{
    req.logOut(()=> {
        successRedirect(req, res, 'You are logged out now', '/signin');
    });
    
}
