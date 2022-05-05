const {
  PostPlaylistSongSchema,
} = require('./PlaylistSongPayloadSchema');
const InvariantError = require('../../exceptions/InvariantError');

const PlaylistsSongValidator = {
  validatePlaylistSongPayload: (payload) => {
    const validationResult = PostPlaylistSongSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistsSongValidator;
