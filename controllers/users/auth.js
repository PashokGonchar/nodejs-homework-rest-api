const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

require('dotenv').config()
const { SECRET_KEY } = process.env

const { User } = require('../../models/users')
const { controllersWrapper } = require('../../middleware')

const registration = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email })
        if (user) {
        return res.status(409).json({ error: "Email is already in use" });
    }

    const hashPassword = await bcryptjs.hash(password, 8)
    const newUser = await User.create ({...req.body, password : hashPassword})

    res.status(201).json({email : newUser.email, subscription: newUser.subscription})
}

const logIn = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email })
    if (!user) {
        return res.status(401).json({ error: 'Email is wrong' });
    }

    const passwordCompare = await bcryptjs.compare(password, user.password);
    if (!passwordCompare) {
        return res.status(401).json({ error: 'Password is wrong' });
    }

    const payload = { id: user._id }
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" })
    await User.findByIdAndUpdate(user._id, { token })
    res.json({ token })
}

const logOut = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" })
    
    res.json({message : "Logout success"})
}

const getCurrent = async (req, res) => {
    const { email, subscription } = req.user;
    res.json({email, subscription})
}

module.exports = {
  registration: controllersWrapper(registration),
  logIn: controllersWrapper(logIn),
  logOut: controllersWrapper(logOut),
  getCurrent: controllersWrapper(getCurrent),
};