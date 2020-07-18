const helpers = {};

helpers.isAuthenticated = (req,res,next) =>{
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error_msg','Not Authenticated, Log in firts')
    res.redirect('/signin');
}

module.exports = helpers;