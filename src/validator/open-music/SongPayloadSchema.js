const Joi = require('joi');

const SongPayloadSchema = Joi.object({
  title: Joi.string().min(1).max(30).required()
    .messages({
      'any.required': 'Gagal menambahkan lagu. Mohon isi title lagu',
    }),
  year: Joi.number().integer().min(1).max(new Date().getFullYear())
    .required()
    .messages({
      'any.required': 'Gagal menambahkan lagu. Mohon isi tahun lagu',
    }),
  genre: Joi.string().min(1).max(30).required()
    .messages({
      'any.required': 'Gagal menambahkan lagu. Mohon isi genre lagu',
    }),
  performer: Joi.string().min(1).max(30).required()
    .messages(
      {
        'any.required': 'Gagal menambahkan lagu. Mohon isi performer lagu',
      },
    ),
  duration: Joi.number().integer().min(1).max(new Date().getFullYear()),
  albumId: Joi.string().min(1).max(30),
});

module.exports = { SongPayloadSchema };
