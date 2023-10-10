const Joi = require('joi');

const contactsSchema = {
  contactsBlog: Joi.object().keys({
    name: Joi.string().min(3).max(30).required(),
 
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    }),
  
    phone: Joi.string()
      .regex(/^[0-9]{10}$/)
      .messages({ 'string.pattern.base': `Phone number must have 10 digits.` })
      .required(),
  })
}
module.exports = contactsSchema;
