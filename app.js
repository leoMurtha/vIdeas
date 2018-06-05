const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

/* Load Routes */
const ideas = require('./routes/ideas');
const users = require('./routes/users');

/* Passport Config */
require('./config/passport')(passport);

/* DB configuration */
const db = require('./config/database');

/* Map global promise - getting rid of warining */
mongoose.Promise = global.Promise;
/* Mongoose Middleware */
/* Connect to mongoose */
mongoose.connect(db.mongoURI)
	.then(() => console.log('Mongo DB Connected...'))
	.catch(err => console.log(err));


/* Handlebars Middleware*/
app.engine('handlebars', exphbs({
	defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

/* Body parser Middleware */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* Static Folder, Path middleware */
/* Sets the public folder as the express static */
app.use(express.static(path.join(__dirname, 'public')));

/* Method override Middleware */
app.use(methodOverride('_method'));

/* Session Middleware */
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

/* Flash Middleware */
app.use(flash());

/* Global Variables */
app.use(function (req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});

/* Index Route:
	req = request stuff
	res = response stuff
*/
app.get('/', (req, res) => {
	const title = 'Welcome';
	res.render('index', {
		title: title
	});
});

/* About route */
app.get('/about', (req, res) => {
	res.render('about');
});

/* Use Routes */
app.use('/ideas', ideas);
app.use('/users', users);

/* process.env.PORT to deploy to heroku */
const port = process.env.PORT || 5000;

app.listen(port, () => {
	/* back ticks work like format in python 3 */
	console.log(`Server started on port ${port}`);
});
