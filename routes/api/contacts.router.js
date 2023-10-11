const express = require('express');
const router = express.Router();
const contactsControllers = require('../../controllers');
const validationMiddleware = require('../../middlewares/validationMiddleware');
const contactsSchema = require('../../schemas/contactsSchemas');

router.get('/', contactsControllers.getAll);

router.get('/:contactId', contactsControllers.getById);

router.post('/', validationMiddleware(contactsSchema), contactsControllers.add);

router.delete('/:contactId', contactsControllers.removeById);

router.put(
  '/:contactId',
  validationMiddleware(contactsSchema),
  contactsControllers.updateById
);

module.exports = router;
