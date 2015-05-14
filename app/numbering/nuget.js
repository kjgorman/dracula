!function () {

    function Nuget (store) {
	this.store = store;
	this.route = {
	    method: 'POST',
	    path: '/nuget/{component}/{action}',
	    handler: this.handler
	};
    }

    function id (x) { return x; }
    function succ (x) { return x + 1 }
    function reset (x) { return 0; }

    function version (major, minor, patch) {
	return { major: major, minor: minor, patch: patch };
    }

    function transform (current) {
	return function (major, minor, patch) {
	    return version(
		major(current.major),
		minor(current.minor),
		patch(current.patch)
	    );
	}
    }

    Nuget.prototype.bugfix = function (current) {
	return transform(current)(id, id, succ);
    }

    Nuget.prototype.addition = function (current) {
	return transform(current)(id, succ, reset);
    }

    Nuget.prototype.breaking = function (current) {
	return transform(current)(succ, reset, reset);
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
