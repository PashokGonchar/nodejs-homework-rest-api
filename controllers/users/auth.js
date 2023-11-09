const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs/promises');
const Jimp = require('jimp');
const { v4: uuidv4 } = require('uuid');

require('dotenv').config();
const { SECRET_KEY } = process.env;

const avatarsDir = path.join(__dirname, '../../', 'public', 'avatars');

const { User } = require('../../models/users');
const { controllersWrapper } = require('../../middleware');
const { sendEmail } = require('../../helpers');

const registration = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    return res.status(409).json({ error: 'Email is already in use' });
  }

  const hashPassword = await bcryptjs.hash(password, 8);
  const avatarURL = gravatar.url(email, { protocol: 'http' });
  const verificationToken = uuidv4();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: 'Verification email sent',
    html: `<a target= "_blank" href="http://localhost:3000/api/users/verify/${verificationToken}">Please click to verify</a>`,
  };

  await sendEmail(verifyEmail);

  res
    .status(201)
    .json({ email: newUser.email, subscription: newUser.subscription });
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params
  
  const user = await User.findOne({ verificationToken })
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null
  })
  res.json({
    message: "Verification successful"
  })
}

const resendVerification = async (req, res) => {
  const { email } = req.body
  const user = await User.findOne({ email })
  if (!user) {
    return res.status(401).json({ error: 'Email not found' });
  }
  if (user.verify) {
    return res.status(400).json({ error: 'Verification has already been passed' });
  }

  const verifyEmail = {
    to: email,
    subject: 'Verification email sent',
    html: `<a target= "_blank" href="http://localhost:3000/api/users/verify/${user.verificationToken}">Please click to verify</a>`,
  };

  await sendEmail(verifyEmail)

  res.json({
  message : "Verification email sent"
})
}

const logIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'Email is wrong' });
  }

  if (!user.verify) {
    return res.status(401).json({ error: 'User is not verified' });
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
  await User.findByIdAndUpdate(_id, { token: '' });

  res.json({ message: 'Logout success' });
};

const getCurrent = async (req, res) => {
  const { email, subscription, avatarURL } = req.user;
  res.json({ email, subscription, avatarURL });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const img = await Jimp.read(tempUpload);
  img.resize(250, 250);
  img.writeAsync(tempUpload);

  const resultUpload = path.join(avatarsDir, filename);
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
  verifyEmail: controllersWrapper(verifyEmail),
  resendVerification : controllersWrapper(resendVerification)
};
