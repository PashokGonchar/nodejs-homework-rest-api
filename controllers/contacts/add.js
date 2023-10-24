const {Contact} = require("../../models/contacts");

const add = async (req, res, next) => {
  const checkExist = await Contact.find({ email: req.body.email });
if (checkExist.length > 0) {
  res.status(400).json('This email already exist');
} else {
  const result = await Contact.create(req.body);
  res.status(201).json(result);
}
}

module.exports = add;