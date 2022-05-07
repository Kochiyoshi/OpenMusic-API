const ClientError = require('../../exceptions/ClientError');

class PlaylistSongHandler {
  constructor(service, validator) {
    const {
      playlistSongService,
      playlistService,
      songService,
    } = service;
    this.playlistSongService = playlistSongService;
    this.playlistService = playlistService;
    this.songService = songService;
    this.validator = validator;

    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
    this.getSongsFromPlaylistHandler = this.getSongsFromPlaylistHandler.bind(this);
    this.deleteSongFromPlaylistHandler = this.deleteSongFromPlaylistHandler.bind(this);
  }

  async postSongToPlaylistHandler(request, h) {
    try {
      this.validator.validatePlaylistSongPayload(request.payload);

      const { id: playlistId } = request.params;
      const { songId } = request.payload;
      const { id: owner } = request.auth.credentials;

      await this.playlistService.verifyPlaylistOwner(playlistId, owner);
      await this.songService.getSongById(songId);

      const songIdResult = await this.playlistSongService.addPlaylistSong(playlistId, songId);
      return h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke Playlist',
        data: {
          songIdResult,
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
        message: error.message,
      }).code(500);
    }
  }

  async getSongsFromPlaylistHandler(request, h) {
    try {
      const { id: playlistId } = request.params;
      const { id: owner } = request.auth.credentials;
      await this.playlistService.verifyPlaylistOwner(playlistId, owner);
      const playlistDetails = await this.playlistService.getPlaylistById(playlistId);
      const playlistSongs = await this.playlistSongService.getPlaylistSongs(playlistId);

      return {
        status: 'success',
        data: {
          playlist: {
            ...playlistDetails,
            songs: playlistSongs.map((song) => ({
              id: song.song_id,
              title: song.title,
              performer: song.performer,
            })),
          },
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

  async deleteSongFromPlaylistHandler(request, h) {
    try {
      this.validator.validatePlaylistSongPayload(request.payload);

      const { id: playlistId } = request.params;
      const { songId } = request.payload;
      const { id: owner } = request.auth.credentials;

      await this.playlistService.verifyPlaylistOwner(playlistId, owner);
      await this.playlistSongService.deleteSongFromPlaylist(playlistId, songId);

      return {
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist',
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
module.exports = PlaylistSongHandler;
