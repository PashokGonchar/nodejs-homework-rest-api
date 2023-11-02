const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs/promises');
const Jimp = require('jimp');

require('dotenv').config();
const { SECRET_KEY } = process.env;

const avatarsDir = path.join(__dirname, '../../', 'public', 'avatars');

const { User } = require('../../models/users');
const { controllersWrapper } = require('../../middleware');

const registration = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    return res.status(409).json({ error: 'Email is already in use' });
  }

  const hashPassword = await bcryptjs.hash(password, 8);
  const avatarURL = gravatar.url(email);
  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });

  res
    .status(201)
    .json({ email: newUser.email, subscription: newUser.subscription });
};

const logIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'Email is wrong' });
  }

  const passwordCompare = await bcryptjs.compare(password, user.password);
  if (!passwordCompare) {
    return res.status(401).json({ error: 'Password is wrong' });
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const logOut = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({ message: "Logout success" });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);
  const img = await Jimp.read(`../../tmp/${originalname}`);
  img.resize(250, 250);
  img.writeAsync(`../../tmp/${originalname}`);
  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join('avatars', filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL });
};

module.exports = {
  registration: controllersWrapper(registration),
  logIn: controllersWrapper(logIn),
  logOut: controllersWrapper(logOut),
  getCurrent: controllersWrapper(getCurrent),
  updateAvatar: controllersWrapper(updateAvatar),
};
