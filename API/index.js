const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader')
const multer = require('multer')
const fs = require('fs')


const User = require('./models/User');
const Place = require('./models/Place')
const Booking = require('./models/Booking.js')

require('dotenv').config();



const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'dasdasdasasdasfdafsfdsgdfgrte'


app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'))
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));


mongoose.connect(process.env.MONGO_URL)

function getUserDataFromToken(req) {
    return new Promise((resolve, reject) => {
        jwt.verify(req.cookies.token, jwtSecret, {}, async (err, user) => {
            if (err) throw err;
            resolve(user);
        });
    });
};


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
            const { name, email, id } = await User.findById(user.id);
            res.json({ name, email, id });
        })
    }
    else {
        res.json(null)
    }

});


app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true);
});
app.post('/upload-by-link', async (req, res) => {
    const { link } = req.body;
    const newName = 'photo' + Date.now() + '.jpg'
    //lib image downloader
    await imageDownloader.image({
        url: link,
        dest: __dirname + '/uploads/' + newName,
    });
    res.json('/uploads/' + newName)
});


const phostoMiddleware = multer({ dest: 'uploads/' })

app.post('/upload', phostoMiddleware.array('photos', 25), (req, res) => {
    console.log(req.files);
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
        const { path, originalname } = req.files[i];
        const parts = originalname.split('.')
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath)
        uploadedFiles.push(newPath.replace('uploads/', ''))
    }
    res.json(uploadedFiles)
});


app.post('/places', (req, res) => {
    const { token } = req.cookies;
    const { title,
        address,
        addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price } = req.body
    jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if (err) throw err;
        const placeDoc = await Place.create({
            owner: user.id,
            title,
            address,
            photos: addedPhotos,
            description,
            perks,
            extraInfo,
            checkIn,
            checkOut,
            maxGuests,
            price
        });
        res.json(placeDoc)
    });
});


app.get("/user-places", (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, user) => {

        const { _id } = user;
        res.json(await Place.find({ owner: _id }))
    });
});


app.get("/places/:id", async (req, res) => {
    const { id } = req.params;
    res.json(await Place.findById(id));
})

app.put("/places", async (req, res) => {
    const { token } = req.cookies;
    const { id, title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if (err) throw err;
        const placeDoc = await Place.findById(id);
        if (user.id === placeDoc.owner.toString()) {
            placeDoc.set({
                title, address, photos: addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price
            });
            await placeDoc.save();
            res.json('ok')
        }
    })
})

app.get('/places', async (req, res) => {
    res.json(await Place.find());
});

app.post('/bookings', async (req, res) => {
    const userData = await getUserDataFromToken(req)
    const { place, checkIn, checkOut, numberOfGuests, name, price, phone } = req.body;
    Booking.create({
        place, checkIn, checkOut, numberOfGuests, name, price, phone,
        user: userData.id
    }).then((doc) => {
        res.json(doc);
    }).catch((err) => {
        throw err;
    })
})




app.get('/bookings', async (req, res) => {
    const userData = await getUserDataFromToken(req);
    res.json( await Booking.find({ user: userData.id }).populate('place') )
});
/*
    owner: {type:mongoose.Schema.Types.ObjectId, ref:"User"},
    title,: String,
    address,: String,
    photos,: [String],
    description,: String,
    perks,: [String],
    extraInfo,: String,
    checkIn,: Number,
    checkOut,: Number,
    maxGuests,: Number,

*/

app.listen(4000);