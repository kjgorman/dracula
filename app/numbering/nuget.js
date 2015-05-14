!function () {

    function Nuget (store) {
	this.store = store;
	this.route = {
	    method: 'POST',
	    path: '/nuget/{component}/{action}',
	    handler: this.handler
	};
    }

    function id(x) { return x; }

    function version (major, minor, patch) {
	return { major: major, minor: minor, patch: patch };
    }

    Nuget.prototype.bugfix = function (current) {
	return version(current.major, current.minor, current.patch + 1);
    }

    Nuget.prototype.addition = function (current) {
	return version(current.major, current.minor+1, 0);
    }

    Nuget.prototype.handler = function (request, reply) {
	var componentName  = request.params.component,
	    currentVersion = this.store(componentName),
	    action         = request.params.action;

	var fn = this[action] || id;

	reply(fn(currentVersion));
    }

    module.exports = Nuget;

}()
