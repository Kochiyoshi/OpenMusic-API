const ExportPlaylistPayloadSchema = require('./ExportPayloadSchema');
const InvariantError = require('../../exceptions/InvariantError');

const ExportValidator = {
  validateExportPlaylistPayload: (payload) => {
    const validationResult = ExportPlaylistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ExportValidator;
