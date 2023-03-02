const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');
require('dotenv').config();



const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'dasdasdasasdasfdafsfdsgdfgrte'


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));


mongoose.connect(process.env.MONGO_URL)


app.get('/test', (req, res) => {
    res.json('test ok');
});
// db password 

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userDoc = await User.create({
            name,
            email,
            //encrypting passwords
            password: bcrypt.hashSync(password, bcryptSalt),
        });
        res.json(userDoc);
    }
    catch (e) {
        res.status(422).json(e)
    }

});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });
    if (userDoc) {
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (passOk) {
            //json web token
            jwt.sign({
                email: userDoc.email,
                id: userDoc._id,
              
            }, jwtSecret,
                {}, (err, token) => {
                    if (err) throw err;
                    res.cookie('token', token).json(userDoc)
                });
        }
        else {
            res.status(422).json('pass not ok')
        }
    }
    else {
        res.json('not found')
    }
});

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    // res.json({ token });
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, user) => {
            if (err) throw err;
            const {name,email,id}=await User.findById(user.id);
            res.json({name,email,id});
        })
    }
    else {
        res.json(null)
    }

});


app.post('/logout',(req,res)=>{
    res.cookie('token','').json(true);
});

app.listen(4000);