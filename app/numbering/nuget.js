!function () {

    function handler (request, reply) {
	reply('foo');
    }

    module.exports = {
	method: 'POST',
	path: '/nuget/{component}/{action}',
	handler: handler
    }

}()
