const express = require('express');
const router = express.Router();
const contactsControllers = require('../../controllers');

router.get('/', contactsControllers.getAll);

router.get('/:contactId', contactsControllers.getById);

router.post('/',  contactsControllers.add);

router.delete('/:contactId', contactsControllers.removeById
);

router.put('/:contactId', contactsControllers.updateById);

module.exports = router;
