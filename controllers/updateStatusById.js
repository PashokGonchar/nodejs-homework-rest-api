const {Contact} = require("../models/contacts");

const updateStatusById = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!result) {
    return res.status(400).json({
      message: `Contact not found!`,
    });
  }

  res.json(result);
};

module.exports = updateStatusById;
