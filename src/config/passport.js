import passport from 'passport';
import { Strategy as LocalStrategy} from 'passport-local';

import User from '../models/User.js';


passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email,password,done) =>{
    try {
        const user = await User.findOne({email});
        if(!user){
            return done(null, false, {message: 'Not User Found'});
        }

        const match = await user.matchPassword(password);
        if(match){
            return done(null, user);
        }

        return done(null, false, {message: 'Incorrect Password'});
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user,done) =>{
    done(null, user.id);
})

passport.deserializeUser(async (id, done) =>{
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
})

export default {passport};
