require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');

// Album
const album = require('./api/album');
const AlbumService = require('./services/postgres/AlbumService');
const AlbumValidator = require('./validator/album');

// Album Likes
const albumLike = require('./api/album-like');
const AlbumLikeService = require('./services/postgres/AlbumLikeService');

// Song
const song = require('./api/song');
const SongService = require('./services/postgres/SongService');
const SongValidator = require('./validator/song');

// User
const user = require('./api/user');
const UserService = require('./services/postgres/UserService');
const UserValidator = require('./validator/user');

// Authentication
const authentication = require('./api/authentication');
const AuthenticationService = require('./services/postgres/AuthenticationService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationValidator = require('./validator/authentication');

// Playlist
const playlist = require('./api/playlist');
const PlaylistService = require('./services/postgres/PlaylistService');
const PlaylistValidator = require('./validator/playlist');

// Playlist Song
const playlistSongs = require('./api/playlist-song');
const PlaylistSongService = require('./services/postgres/PlaylistSongService');
const PlaylistSongValidator = require('./validator/playlist-song');

// Export
const exportssss = require('./api/export');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportValidator = require('./validator/export');

// Upload
const upload = require('./api/upload');
const StorageService = require('./services/storage/StorageService');
const UploadValidator = require('./validator/upload');

// cache
const CacheService = require('./services/redis/CacheService');

const init = async () => {
  const cacheService = new CacheService();
  const albumService = new AlbumService();
  const albumLikeService = new AlbumLikeService(cacheService);
  const songService = new SongService();
  const userService = new UserService(cacheService);
  const authenticationService = new AuthenticationService();
  const playlistService = new PlaylistService();
  const playlistSongService = new PlaylistSongService();
  const storageService = new StorageService(path.resolve(__dirname, 'api/upload/file/images'));

  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy('openmusicapi_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: album,
      options: {
        service: albumService,
        validator: AlbumValidator,
      },
    },
    {
      plugin: albumLike,
      options: {
        service:
        {
          albumLikeService,
          albumService,
          userService,
        },
      },
    },
    {
      plugin: song,
      options: {
        service: songService,
        validator: SongValidator,
      },
    },
    {
      plugin: user,
      options: {
        service: userService,
        validator: UserValidator,
      },
    },
    {
      plugin: authentication,
      options: {
        authenticationService,
        userService,
        tokenManager: TokenManager,
        validator: AuthenticationValidator,
      },
    },
    {
      plugin: playlist,
      options: {
        service: playlistService,
        validator: PlaylistValidator,
      },
    },
    {
      plugin: playlistSongs,
      options: {
        service: {
          playlistSongService,
          playlistService,
          songService,
        },
        validator: PlaylistSongValidator,
      },
    },
    {
      plugin: exportssss,
      options: {
        service: {
          playlistService,
          ProducerService,
        },
        validator: ExportValidator,
      },
    },
    {
      plugin: upload,
      options: {
        service: {
          storageService,
          albumService,
        },
        validator: UploadValidator,
      },
    },
  ]);

  await server.start();
  // eslint-disable-next-line no-console
  console.log(`Server running in ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  // eslint-disable-next-line no-console
  console.log(err);
  process.exit(1);
});

init();
