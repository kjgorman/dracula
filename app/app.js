!function () {

    var nuget = require("./numbering/nuget.js")

    function configure (server) {
	server.route(nuget);

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
