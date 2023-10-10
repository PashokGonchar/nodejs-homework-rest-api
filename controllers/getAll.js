const contacts = require('../models/contacts');

const getAll = async (req, res, next) => {
  const contactList = contacts.listContacts();
  res.status(200).json(contactList);
};

module.exports = getAll