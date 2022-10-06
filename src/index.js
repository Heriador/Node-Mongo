
import {config} from 'dotenv';
config()

import express from 'express';
import exphbs from 'express-handlebars';
import { join, dirname} from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import methodOverride from 'method-override';
import flash from 'connect-flash';
import session from 'express-session';
import passport from 'passport';

import './config/passport.js';
import './database.js'

import indexRoutes from './routes/index.routes.js';
import usersRoutes from './routes/users.routes.js';
import notesRoutes from './routes/notes.routes.js';

const port = process.env.PORT;



// Initializations
const app = express ();
const __dirname = dirname(fileURLToPath(import.meta.url));


// Setting
app.set('port', process.env.PORT || 4000);
app.set('views', join(__dirname,'views'));
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: join(app.get('views'), 'layouts'),
    partialsDir: join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', 'hbs');

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global variables
app.use((req,res,next) =>{
    res.locals.succes_msg = req.flash('succes_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})


// Routes
app.use(indexRoutes);
app.use(usersRoutes);
app.use(notesRoutes);


//Static files
app.use(express.static(join(__dirname,'public')))


app.listen(port)

console.log(`server on port ${port}`);
