const {Contact} = require("../models/contacts");

const removeById = async (req, res, next) => {
  const { contactId } = req.params;

  const result = await Contact.findByIdAndRemove(contactId);

if (!result) {
  return res.status(400).json({
    message: `Contact not found!`,
  });
}

  res
    .status(200)
    .json({ message: `Contact with ID=${contactId} deleted successfully!` });
};

module.exports = removeById;
