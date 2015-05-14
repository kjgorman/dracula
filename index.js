var Hapi  = require('hapi'),
    chalk = require('chalk'),
    app   = require('./app/app.js');


var server = new Hapi.Server();
server.connection({ port: 3000 });

app.configure(server);

server.start(function () {
    console.log(chalk.cyan('Server running at:'), server.info.uri);
});
