/* eslint-disable camelcase */

// exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('albums', {
    album_id: { type: 'VARCHAR(30)', primaryKeys: true },
    name: { type: 'VARCHAR(30)', notNull: true },
    year: { type: 'SMALLINT', notNull: true },
  });
  pgm.createTable('songs', {
    song_id: { type: 'VARCHAR(30)', primaryKeys: true },
    title: { type: 'VARCHAR(30)', notNull: true },
    year: { type: 'SMALLINT', notNull: true },
    genre: { type: 'VARCHAR(30)', notNull: true },
    performer: { type: 'VARCHAR(30)', notNull: true },
    duration: { type: 'SMALLINT' },
    album_id: { type: 'VARCHAR(30)' },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('albums');
  pgm.dropTable('songs');
};
