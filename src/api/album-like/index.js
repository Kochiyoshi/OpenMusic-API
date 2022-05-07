const AlbumLikeHandler = require('./handlers');
const routes = require('./routes');

module.exports = {
  name: 'album likes',
  version: '1.0.0',
  register: async (server, { service }) => {
    const albumLikeHandler = new AlbumLikeHandler(service);
    server.route(routes(albumLikeHandler));
  },
};
