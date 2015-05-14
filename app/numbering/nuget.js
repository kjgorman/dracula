!function () {

    function Nuget (store) {
	this.store = store;
	this.revise = {
	    method: 'POST',
	    path: '/nuget/{component}/{action}',
	    handler: this.revision.bind(this)
	};

	this.create = {
	    method: 'PUT',
	    path: '/nuget/{component}/{major}/{minor}/{patch}',
	    handler: this.creation.bind(this)
	};
    }

    Nuget.prototype.route = function route(server) {
	server.route(this.revise);
	server.route(this.create);
    }

    function id    (x) { return x; }
    function succ  (x) { return x + 1 }
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

    Nuget.prototype.revision = function (request, reply) {
	var componentName  = request.params.component,
	    fn             = (this[request.params.action] || id),
            store          = this.store;

	store.get(componentName, function (err, res) {
	    if (err) {
		reply(err, null);
		return;
	    }

            var next = fn(res.value.version)

            store.set(componentName, next, function (err, res) {
                reply(err || res);
            });
	})
    }

    Nuget.prototype.creation = function (request, reply) {
	var componentName = request.params.component,
	    major = request.params.major,
	    minor = request.params.minor,
	    patch = request.params.patch;

	this.store.get(componentName, function (err, res) {
	    if (err) {
		reply(err);
		return;
	    }

	    if (res != null) {
                reply(new Error("cannot create an existing component"));
            }

	    reply(this.store.set(componentName, version(major, minor, patch)));
	});
    }

    module.exports = Nuget;

}()
