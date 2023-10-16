const contacts = require('../models/contacts');

const getById = async (req, res, next) => {
  const contactId = req.params.contactId;

  const foundContact = contacts.getContactById(
    contactId,
    `Contact not found!`
  );

  if (!foundContact) {
    return res.status(400).json({
      message: `Contact not found!`,
    });
  }

  res.status(200).json(foundContact);
};

module.exports = getById;
