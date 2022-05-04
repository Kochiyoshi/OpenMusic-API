const Joi = require('joi');

const UserPayloadSchema = Joi.object({
  username: Joi.string().required().messages({
    'any.required': 'Gagal menambahkan user. Mohon isi username',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Gagal menambahkan user. Mohon isi password',
  }),
  fullname: Joi.string().required().messages({
    'any.required': 'Gagal menambahkan user. Mohon isi fullname',
  }),
});

module.exports = { UserPayloadSchema };
