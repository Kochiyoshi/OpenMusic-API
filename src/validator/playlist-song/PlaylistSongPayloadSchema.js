const Joi = require('joi');

const PostPlaylistSongSchema = Joi.object({
  songId: Joi.string().required().messages({
    'any.required': 'Gagal menambahkan song playlist. Mohon isi songId',
  }),
});

module.exports = { PostPlaylistSongSchema };
