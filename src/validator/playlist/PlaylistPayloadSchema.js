const Joi = require('joi');

const PostPlaylistPayloadSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Gagal menambahkan playlist. Mohon isi name playlist',
  }),
});

module.exports = { PostPlaylistPayloadSchema };
