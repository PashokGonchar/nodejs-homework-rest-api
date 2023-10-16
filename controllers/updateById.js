const contacts = require('../models/contacts');

const updateById = async (req, res, next) => {
  const contactId = req.params.contactId;
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({
      message: 'Missing required name field',
    });
  }

  const updateContacts = contacts.updateContact(
    contactId,
    name,
    email,
    phone,
    `Contact not found!`
  );

  if (!updateContacts) {
    return res.status(404).json({
      message: `Contact not found!`,
    });
  }

  res.status(200).json(updateContacts);
};

module.exports = updateById;
