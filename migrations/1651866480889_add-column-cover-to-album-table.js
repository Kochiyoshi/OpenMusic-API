/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns( 'albums', {
        cover: {
            type: 'TEXT',
            unique : true,
        }
    })
};

exports.down = pgm => {
    pgm.dropColumns( 'albums', ['cover'])
};
