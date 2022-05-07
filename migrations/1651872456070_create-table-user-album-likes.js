exports.up = (pgm) => {
    pgm.createTable('user_album_likes', {
      id: {
        type: 'VARCHAR(50)',
        primaryKey: true,
      },
      user_id: {
        type: 'VARCHAR(50)',
        notNull: true,
      },
      album_id: {
        type: 'VARCHAR(30)',
        notNull: true,
      },
    });
  
    pgm.addConstraint('user_album_likes', 'fk_user_album_likes.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
    pgm.addConstraint('user_album_likes', 'fk_user_album_likes.album_id_albums.album_id', 'FOREIGN KEY(album_id) REFERENCES albums(album_id) ON DELETE CASCADE');
  };
  
  exports.down = (pgm) => {
    pgm.dropTable('user_album_likes');
  };