const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistService {
  constructor() {
    this.pool = new Pool();
  }

  async verifyPlaylistOwner(playlistId, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukans');
    }
    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak memiliki akses ke playlist ini');
    }
  }

  async addPlaylist(name, owner) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getPlaylist(owner) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username FROM playlists 
              LEFT JOIN users ON users.id = playlists.owner 
              WHERE playlists.owner = $1`,
      values: [owner],
    };

    const result = await this.pool.query(query);
    return result.rows;
  }

  async getPlaylistById(playlistId) {
    const result = await this.pool.query({
      text: `SELECT playlists.id, playlists.name, users.username FROM playlists 
              LEFT JOIN users ON users.id = playlists.owner 
              WHERE playlists.id = $1`,
      values: [playlistId],
    });
    if (!result.rows.length) {
      throw new NotFoundError('Playlists tidak ditemukan');
    }
    return result.rows[0];
  }

  async deletePlaylistById(playlistId) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [playlistId],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Playlist gagal dihapus, id tidak ditemukan');
    }
  }
}

module.exports = PlaylistService;
