!function () {

    var Nuget = require("./numbering/nuget.js"),
	storage = require("./persistence/couch.js");

    function configure (server) {
	new Nuget(storage.nuget).route(server);

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
