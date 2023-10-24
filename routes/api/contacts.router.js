const express = require('express');
const router = express.Router();
const contactsControllers = require('../../controllers/contacts');
const {validateBody} = require('../../middleware')
const {schemas} = require('../../models/contacts')

router.get('/', contactsControllers.getAll);

router.get('/:contactId', contactsControllers.getById);

router.post('/', validateBody(schemas.addSchema), contactsControllers.add);

router.delete('/:contactId', contactsControllers.removeById);

router.patch(
  '/:contactId/favorite',
  validateBody(schemas.updateFavoriteSchema),
  contactsControllers.updateStatusById
);

router.put(
  '/:contactId',
  validateBody(schemas.addSchema),
  contactsControllers.updateById
);

module.exports = router;
