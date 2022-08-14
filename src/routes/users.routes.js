import { Router } from "express";
import { 
    renderSignUpForm,
    signUp,
    renderSignInForm,
    signIn,
    logOut,
} from "../controllers/users.controller.js";



const router = Router();


//SIGNUP
router.get("/signup", renderSignUpForm);
router.post('/signup',signUp)

//SINGIN
router.get('/signin', renderSignInForm)
router.post('/signin', signIn);

//LOGOUT
router.get('/logout', logOut);

export default router;

