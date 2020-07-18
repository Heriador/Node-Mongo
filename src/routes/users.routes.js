const { Router } = require("express");
const router = Router();
const {
    renderSignUpForm,
    signUp,
    renderSignInForm,
    signin,
    logOut,
} = require("../controllers/users.controller");

//SIGNUP
router.get("/signup", renderSignUpForm);
router.post('/signup',signUp)

//SINGIN
router.get('/signin', renderSignInForm)
router.post('/signin', signin);

//LOGOUT
router.get('/logout', logOut);

module.exports = router;
