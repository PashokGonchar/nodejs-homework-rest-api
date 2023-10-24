const Joi = require("joi");
const { Schema, model } = require("mongoose")

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  { versionKey: false }
);

const addSchema = Joi.object({
  name: Joi.string().min(5).max(30).required(),
  email: Joi.string()
  .email({minDomainSegments: 2, tlds: {allow: ['com', 'net', 'ua']}})
    .required(),
  phone: Joi.string().min(8).max(15).required(),
  favorite: Joi.boolean(),
})

const updateFavoriteSchema = Joi.object({
  favorite:Joi.boolean().required(),
})

const schemas = {addSchema, updateFavoriteSchema}

const Contact = model("contact" , contactSchema)

module.exports = {Contact, schemas}