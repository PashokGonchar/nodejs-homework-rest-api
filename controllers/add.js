const contacts = require("../models/contacts");

const add = async (req, res, next) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({
      message: 'Missing required name field',
    });
  }

  const updateContact = await contacts.addContact(name, email, phone);

  res.status(201).json(updateContact);
}

module.exports = add;