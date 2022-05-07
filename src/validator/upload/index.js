const InvariantError = require('../../exceptions/InvariantError');
const { ImageHeaderSchema } = require('./UploadHeaderSchema');

const UploadValidator = {
  validateImageHeaders: (headers) => {
    const validationResult = ImageHeaderSchema.validate(headers);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UploadValidator;
