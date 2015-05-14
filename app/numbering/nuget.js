!function () {

    function handler (request, reply) {
	reply("hello world");
    }

    module.exports = {
	method: "GET",
	path: "/nuget",
	handler: handler
    }

}()
