// server.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const app = express();

// Connect to Database
connectDB();

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

// Swagger Configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Inventory API',
            version: '1.0.0',
            description: 'API for managing warehouse inventory',
            contact: {
                name: 'Your Name'
            },
            servers: [{ url: 'http://localhost:3000' }]
        }
    },
    
    apis: ['./routes/*.js'] 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// Middleware to parse JSON
app.use(express.json());

// Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// GitHub Strategy Configuration
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Import Routes
const itemsRouter = require('./routes/items');
const errorHandler = require('./middleware/error');

// Authentication Route - Login Route
app.get('/login', passport.authenticate('github', { scope: [ 'user:email' ] }));

// Authentication Route - Callback Route
app.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/api-docs', session: false }),
  (req, res) => {
    req.session.user = req.user;
    res.send('Logged in successfully! Go to <a href="/api-docs">Swagger Docs</a> to test routes.');
  }
);

// Authentication Route - Logout Route
app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.session.destroy();
        res.redirect('/api-docs');
    });
});

// Authentication Route - Status Route
app.get('/auth/status', (req, res) => {
    res.json(req.session.user !== undefined ? { loggedIn: true, user: req.session.user } : { loggedIn: false });
});


// Use Routes
app.use('/api/items', itemsRouter); 
app.use('/api/items', require('./routes/items'));

app.use(errorHandler);

// ... app.listen code ...

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});