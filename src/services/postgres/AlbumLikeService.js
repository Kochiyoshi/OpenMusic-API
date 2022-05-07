const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');

class AlbumLikeService {
  constructor(cacheService) {
    this.pool = new Pool();
    this.cacheService = cacheService;
  }

  async checkAlbumLike(userId, albumId) {
    const query = {
      text: `SELECT * FROM user_album_likes
                    WHERE user_id = $1 AND album_id = $2`,
      values: [userId, albumId],
    };
    const result = await this.pool.query(query);

    if (!result.rows.length) {
      return false;
    }

    return true;
  }

  async addAlbumLike(userId, albumId) {
    const id = `like-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('like gagal ditambahkan');
    }

    await this.cacheService.delete(`albumLike:${albumId}`);
  }

  async getAlbumLike(albumId) {
    try {
      const result = await this.cacheService.get(`albumLike:${albumId}`);
      const cached = true;
      const likes = JSON.parse(result);
      return { cached, likes };
    } catch (error) {
      const query = {
        text: 'SELECT * FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };

      const result = await this.pool.query(query);
      await this.cacheService.set(`albumLike:${albumId}`, JSON.stringify(result.rows.length));

      const cached = false;
      const likes = result.rows.length;
      return { cached, likes };
    }
  }

  async deleteAlbumLike(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('id tidak ditemukan, like gagal dihapus');
    }
    await this.cacheService.delete(`albumLike:${albumId}`);
  }
}

module.exports = AlbumLikeService;
