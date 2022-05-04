require('dotenv').config();

const Hapi = require('@hapi/hapi');

const album = require('./api/album');
const AlbumService = require('./services/postgres/AlbumService');
const AlbumValidator = require('./validator/album');

const song = require('./api/song');
const SongService = require('./services/postgres/SongService');
const SongValidator = require('./validator/song');

const user = require('./api/user');
const UserService = require('./services/postgres/UserService');
const UserValidator = require('./validator/user');

const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongService();
  const userService = new UserService();

  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // server.route(routes);

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
