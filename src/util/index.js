/* eslint-disable camelcase */
const mapAlbumToModel = ({
  album_id,
  name,
  year,
  cover,
}) => ({
  id: album_id,
  name,
  year,
  cover,
});

const mapSongToModel = ({
  song_id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
}) => ({
  id: song_id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId: album_id,
});

const mapPlaylistToModel = ({
  id,
  name,
  owner,
}) => ({
  id,
  name,
  owner,
});

const mapPlaylistSongToModel = ({
  id,
  playlist_id,
  songs_id,
}) => ({
  id,
  playlistId: playlist_id,
  songId: songs_id,
});

module.exports = {
  mapAlbumToModel,
  mapSongToModel,
  mapPlaylistToModel,
  mapPlaylistSongToModel,
};
