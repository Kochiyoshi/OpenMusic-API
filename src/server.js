require('dotenv').config();

const Hapi = require('@hapi/hapi');
const openMusicAPI = require('./api/open-music');
const OpenMusicService = require('./services/postgres/OpenMusicService');
const OpenMusicValidator = require('./validator/open-music');

const init = async () => {
  const openMusicService = new OpenMusicService();

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

  await server.register({
    plugin: openMusicAPI,
    options: {
      service: openMusicService,
      validator: OpenMusicValidator,
    },
  });

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
