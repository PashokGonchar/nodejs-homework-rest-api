const {Contact} = require("../../models/contacts");

const getById = async (req, res, next) => {
  const { contactId } = req.params;

  const result = await Contact.findById(contactId);

  if (!result) {
    return res.status(404).json({
      message: `Contact not found!`,
    });
  }

  res.status(200).json(result);
};

module.exports = getById;
