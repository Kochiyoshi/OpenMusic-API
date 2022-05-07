const Joi = require('joi');

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().min(1).max(30).required()
    .messages({
      'any.required': 'Gagal menambahkan album. Mohon isi nama album',
    }),
  year: Joi.number().integer().min(1).max(new Date().getFullYear())
    .required()
    .messages({
      'any.required': 'Gagal menambahkan album. Mohon isi tahun album',
    }),
  cover: Joi.string(),
});

module.exports = { AlbumPayloadSchema };
