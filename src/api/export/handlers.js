const ClientError = require('../../exceptions/ClientError');

class ExportsHandler {
  constructor(service, validator) {
    const {
      playlistService,
      ProducerService,
    } = service;
    this.playlistService = playlistService;
    this.ProducerService = ProducerService;
    this.validator = validator;

    this.postExportPlaylistHandler = this.postExportPlaylistHandler.bind(this);
  }

  async postExportPlaylistHandler(request, h) {
    try {
      this.validator.validateExportPlaylistPayload(request.payload);
      const { playlistId } = request.params;
      const { id: owner } = request.auth.credentials;
      await this.playlistService.verifyPlaylistOwner(playlistId, owner);

      const message = {
        targetEmail: request.payload.targetEmail,
        playlistId,
      };

      await this.ProducerService.sendMessage('export:playlist', JSON.stringify(message));

      return h.response({
        status: 'success',
        message: 'Permintaan dalam antrian',
      }).code(201);
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode);
      }
      return h.response({
        status: 'error',
        message: error.message,
      }).code(500);
    }
  }
}

module.exports = ExportsHandler;
