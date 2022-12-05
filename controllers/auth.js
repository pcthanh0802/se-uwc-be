require('dotenv').config();

const User = require('../models/user');
const RefreshToken = require('../models/refreshToken');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function generateAccessToken(user) {
    // generate JWT from given user
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
};

async function createAccount(req, res) {
    try{
        const user = req.body;
        await User.createAccount(user);

        // response
        res.status(201).send("Account created successfully");
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}

async function login(req, res) {
    // search for user in db
    const user = await User.getEmployeeByUsername(req.body.username);
    if(!user) return res.status(404).send("User not found");

    try{
        console.log("Hello");
        // check for correct password
        const isCorrectPw = await bcrypt.compare(req.body.password, user.password);

        if(isCorrectPw){
            // grant access token and refresh token
            const params = {
                username: user.username,
                role: user.role
            }
            const accessToken = generateAccessToken(params);
            const refreshToken = jwt.sign(params, process.env.REFRESH_TOKEN_SECRET);

            // store refresh token to db
            await RefreshToken.insertRefreshToken(refreshToken);
            
            // response
            res.json({ accessToken, refreshToken });
        }
        else{
            res.sendStatus(401);
        }
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}

async function regrantToken(req, res) {
    // check if refresh token is available in the payload
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
   
    // check for refresh token authenticity
    const tokenExist = await RefreshToken.refreshTokenExist(refreshToken);
    if (!tokenExist) return res.sendStatus(403);

    // verify token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)

        // regrant access token 
        const accessToken = generateAccessToken({ name: user.username, role: user.role })
        res.json({ accessToken })
    })
}

async function logout(req, res) {
    await RefreshToken.removeRefreshToken(req.body.token);
    res.sendStatus(204);
}

module.exports = {
    createAccount,
    login,
    regrantToken,
    logout
}