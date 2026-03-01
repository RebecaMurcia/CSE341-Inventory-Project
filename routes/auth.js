const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

//REGISTER route
/**
 * @swagger
 * /api/auth/register:
 *  post:
 *    summary: Register a new local user
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *          required:
 *            - username
 *            - password
 *          properties:
 *            username:
 *              type: string
 *            password:
 *              type: string
 *    responses:
 *      201:
 *        description: User registered successfully
 *      400:
 *        description: User already exists or missing data
 *      500:
 *        description: Server error
 */

router.post('/register', async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Please provide a username and password' });
        }

        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ success: false, message: 'Username is already taken' });
        }

        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            username: username,
            password: hashedPassword 
        });
        await user.save();

        res.status(201).json({ success: true, message: 'User registered successfully. You can now log in.' });
    } catch (err) {
        next(err);
    }
});

// POST/ login route
/**
 * @swagger
 * /api/auth/login:
 *  post:
 *    summary: Log in with local credentials
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *          required:
 *            - username
 *            - password
 *          properties:
 *            username:
 *              type: string
 *            password:
 *              type: string
 *    responses:
 *      200:
 *        description: Logged in successfully
 *      401:
 *        description: Incorrect username or password
 *      500:
 *        description: Server error
 */

router.post('/login', (req, res, next) => {
    const passport = require('passport'); 

    passport.authenticate('local', (err, user, info) => {
        if (err) { return next(err); }
        
        if (!user) { 
            return res.status(401).json({ success: false, message: info.message || 'Login failed' }); 
        }

        req.logIn(user, (err) => {
            if (err) { return next(err); }
            
            req.session.user = user; 
            
            return res.status(200).json({ 
                success: true, 
                message: 'Logged in successfully!', 
                user: { username: user.username } 
            });
        });
    })(req, res, next);
});

module.exports = router;