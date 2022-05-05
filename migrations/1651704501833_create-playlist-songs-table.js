/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('playlist_songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    songs_id: {
      type: 'VARCHAR(30)',
      notNull: true,
    },
  });

  pgm.addConstraint('playlist_songs', 'unique_playlist_id_and_songs_id', 'UNIQUE(playlist_id, songs_id)');

  pgm.addConstraint('playlist_songs', 'fk_playlist_songs.playlist_id_playlists.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
  pgm.addConstraint('playlist_songs', 'fk_playlist_songs.songs_id_songs.song_id', 'FOREIGN KEY(songs_id) REFERENCES songs(song_id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_songs');
};
