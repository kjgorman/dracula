!function () {

    var Nuget   = require('./numbering/nuget.js'),
        Deploy  = require('./numbering/deploy.js'),
        Range   = require('./query/range.js'),
        storage = require('./persistence/couch.js');

    function configure (server) {
        new Nuget(storage.nuget).route(server);
        new Deploy(storage.deploy).route(server);
        new Range(storage.range).route(server);

        server.route({
            method: 'GET',
            path: '/',
            handler: function (request, reply) {
                storage.nuget.get('XeroWeb', function (err, res) {
                    reply(err || res);
                });
            }
        });
    }

    module.exports = {
        configure: configure
    };
}();
