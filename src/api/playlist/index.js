const PlaylistHandler = require('./handlers');
const routes = require('./routes');

module.exports = {
  name: 'playlist',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const playlistHandler = new PlaylistHandler(service, validator);
    server.route(routes(playlistHandler));
  },
};
