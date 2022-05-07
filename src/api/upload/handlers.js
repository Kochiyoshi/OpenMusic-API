const ClientError = require('../../exceptions/ClientError');

class UploadHandler {
  constructor(service, validator) {
    const {
      storageService,
      albumService,
    } = service;
    this.storageService = storageService;
    this.albumService = albumService;
    this.validator = validator;

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
  }

  async postUploadImageHandler(request, h) {
    try {
      const { cover } = request.payload;
      const { id } = request.params;
      this.validator.validateImageHeaders(cover.hapi.headers);

      const filename = await this.storageService.writeFile(cover, cover.hapi);

      const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;
      await this.albumService.editAlbumCoverById(id, fileLocation);

      return h.response({
        status: 'success',
        message: 'Sampul berhasil diunggah',
        data: {
          fileLocation,
        },
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
        message: 'Maaf, terjadi kegagalan pada server kami.',
      }).code(500);
    }
  }
}

module.exports = UploadHandler;
