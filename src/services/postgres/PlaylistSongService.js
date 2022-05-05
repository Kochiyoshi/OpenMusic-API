const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongService {
  constructor() {
    this.pool = new Pool();
  }

  async addPlaylistSong(playlistId, songId) {
    const id = `playlistSong-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('lagu Playlist gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getPlaylistSongs(playlistId) {
    const query = {
      text: `SELECT songs.song_id, songs.title, songs.performer FROM songs
              LEFT JOIN playlist_songs ON songs.song_id = playlist_songs.songs_id 
              WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist kosong');
    }

    return result.rows;
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND songs_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('id tidak ditemukan, lagu gagal dihapus');
    }
  }
}

module.exports = PlaylistSongService;
