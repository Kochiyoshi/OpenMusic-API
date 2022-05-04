require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

const album = require('./api/album');
const AlbumService = require('./services/postgres/AlbumService');
const AlbumValidator = require('./validator/album');

const song = require('./api/song');
const SongService = require('./services/postgres/SongService');
const SongValidator = require('./validator/song');

const user = require('./api/user');
const UserService = require('./services/postgres/UserService');
const UserValidator = require('./validator/user');

const authentication = require('./api/authentication');
const AuthenticationService = require('./services/postgres/AuthenticationService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationValidator = require('./validator/authentication');

const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongService();
  const userService = new UserService();
  const authenticationService = new AuthenticationService();

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
