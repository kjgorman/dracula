!function () {

    var Nuget = require("./numbering/nuget.js")

    function configure (server) {
	server.route(new Nuget().handler);

	server.route({
	    method: 'GET',
	    path: '/',
	    handler: function (request, reply) {
		reply('Hello, world!');
	    }
	});
    }

    module.exports = {
	configure: configure
    };
}();
