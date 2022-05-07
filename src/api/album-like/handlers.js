const ClientError = require('../../exceptions/ClientError');

class AlbumLikeHandler {
  constructor(service) {
    const {
      albumLikeService,
      albumService,
      userService,
    } = service;
    this.albumLikeService = albumLikeService;
    this.albumService = albumService;
    this.userService = userService;

    this.postAlbumLikeHandler = this.postAlbumLikeHandler.bind(this);
    this.getAlbumLikeHandler = this.getAlbumLikeHandler.bind(this);
  }

  async postAlbumLikeHandler(request, h) {
    try {
      const { id: albumId } = request.params;
      const { id: userId } = request.auth.credentials;

      await this.userService.getUserById(userId);
      await this.albumService.getAlbumById(albumId);
      const checkAlbumLike = await this.albumLikeService.checkAlbumLike(userId, albumId);
      let status = '';

      if (checkAlbumLike) {
        await this.albumLikeService.deleteAlbumLike(userId, albumId);
        status = 'dihapus';
      } else {
        await this.albumLikeService.addAlbumLike(userId, albumId);
        status = 'ditambah';
      }

      return h.response({
        status: 'success',
        message: `Like album berhasil ${status}`,
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

  async getAlbumLikeHandler(request, h) {
    try {
      const { id: albumId } = request.params;
      await this.albumService.getAlbumById(albumId);
      const { cached, likes } = await this.albumLikeService.getAlbumLike(albumId);

      if (cached) {
        return h.response({
          status: 'success',
          data: {
            likes,
          },
        }).header('X-Data-Source', 'cache');
      }
      return {
        status: 'success',
        data: {
          likes,
        },
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

module.exports = AlbumLikeHandler;
