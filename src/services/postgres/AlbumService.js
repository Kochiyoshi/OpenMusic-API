const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapAlbumToModel } = require('../../util');

class AlbumService {
  constructor() {
    this.pool = new Pool();
  }

  async addAlbum({ name, year, cover }) {
    const id = `album-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4) RETURNING album_id',
      values: [id, name, year, cover],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0].album_id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].album_id;
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT album_id, name, year, cover FROM albums WHERE album_id = $1',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return result.rows.map(mapAlbumToModel)[0];
  }

  async editAlbumById(id, { name, year, cover }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, cover = $3 WHERE album_id = $4 RETURNING album_id', // add RETURNING id for get only id property
      values: [name, year, cover, id],
    };

    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album, Album tidak ditemukan');
    }
  }

  async editAlbumCoverById(id, coverUrl) {
    const query = {
      text: 'UPDATE albums SET cover = $1 WHERE album_id = $2 RETURNING album_id', // add RETURNING id for get only id property
      values: [coverUrl, id],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui cover album, Album tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE album_id = $1 RETURNING album_id',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = AlbumService;
