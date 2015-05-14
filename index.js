var Hapi = require('hapi'),
    chalk = require('chalk');

var server = new Hapi.Server();
server.connection({ port: 3000 });

server.start(function () {
    console.log(chalk.cyan('Server running at:'), server.info.uri);
});
