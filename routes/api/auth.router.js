const express = require('express');
const authControllers = require('../../controllers/users/auth');
const { validateBody } = require('../../middleware');
const { authenticate, upload } = require('../../middleware');
const { schemas } = require('../../models/users');
const router = express.Router();

router.post(
  '/register',
  validateBody(schemas.registrationSchema),
  authControllers.registration
);

router.post('/login', validateBody(schemas.loginSchema), authControllers.logIn);

router.post('/logout', authenticate, authControllers.logOut);

router.get("/current", authenticate, authControllers.getCurrent)

router.patch("/avatars", authenticate, upload.single("avatar"), authControllers.updateAvatar)

module.exports = router;

