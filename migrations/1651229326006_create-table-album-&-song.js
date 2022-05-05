/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('albums', {
    album_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: { type: 'VARCHAR(30)', notNull: true },
    year: { type: 'SMALLINT', notNull: true },
  });
  pgm.createTable('songs', {
    song_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: { type: 'VARCHAR(30)', notNull: true },
    year: { type: 'SMALLINT', notNull: true },
    genre: { type: 'VARCHAR(30)', notNull: true },
    performer: { type: 'VARCHAR(30)', notNull: true },
    duration: { type: 'SMALLINT' },
    album_id: { type: 'VARCHAR(30)', unique: true },
  });

  pgm.addConstraint('songs', 'fk_songs.album_id_albums.album_id', 'FOREIGN KEY(album_id) REFERENCES albums(album_id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('albums');
  pgm.dropTable('songs');
};
