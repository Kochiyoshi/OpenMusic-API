const ClientError = require('../../exceptions/ClientError');

class playlistHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    try {
      this.validator.validatePostPlaylistPayload(request.payload);

      const { id: owner } = request.auth.credentials; // owner = id
      const { name } = request.payload;

      const playlistId = await this.service.addPlaylist(name, owner);
      return h.response({
        status: 'success',
        message: 'Playlist ditambahkan',
        data: { playlistId },
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

  async getPlaylistsHandler(request, h) {
    try {
      const { id: owner } = request.auth.credentials;
      const playlists = await this.service.getPlaylist(owner);
      return {
        status: 'success',
        data: { playlists },
      };
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

  async deletePlaylistByIdHandler(request, h) {
    try {
      const { id: playlistId } = request.params;
      const { id: owner } = request.auth.credentials;
      await this.service.verifyPlaylistOwner(playlistId, owner);
      await this.service.deletePlaylistById(playlistId);
      return {
        status: 'success',
        message: 'Playlist dihapus',
      };
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
module.exports = playlistHandler;
