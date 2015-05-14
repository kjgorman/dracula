!function () {

    function Nuget (store) {
	this.store = store;
	this.revise = {
	    method: 'POST',
	    path: '/nuget/{hash}/{component}/{action}',
	    handler: this.revision.bind(this)
	};

	this.create = {
	    method: 'PUT',
	    path: '/nuget/{hash}/{component}/{type}/{major}/{minor}/{patch}',
	    handler: this.creation.bind(this)
	};
    }

    Nuget.prototype.route = function route(server) {
	server.route(this.revise);
	server.route(this.create);
    };

    function id    (x) { return +x; }
    function succ  (x) { return +x + 1; }
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
	};
    }

    Nuget.prototype.bugfix = function (current) {
	return transform(current)(id, id, succ);
    };

    Nuget.prototype.addition = function (current) {
	return transform(current)(id, succ, reset);
    };

    Nuget.prototype.breaking = function (current) {
	return transform(current)(succ, reset, reset);
    };

    Nuget.prototype.revision = function (request, reply) {
	var componentName  = request.params.component,
            hash           = request.params.hash,
	    fn             = (this[request.params.action] || function (x) { return x; }),
            store          = this.store;

	store.get(componentName, function (err, res) {
	    if (err) {
		reply(err, null);
		return;
	    }

            var next = fn(res.value.version);

            store.set(componentName, hash, res.value.type, next, function (err, res) {
                reply(err || res);
            });
	});
    };

    Nuget.prototype.creation = function (request, reply) {
	var componentName = request.params.component,
	    major = request.params.major,
	    minor = request.params.minor,
	    patch = request.params.patch,
            type  = request.params.type,
            hash  = request.params.hash,
            store = this.store;

	store.get(componentName, function (err, res) {
	    if (err) {
		reply(err);
		return;
	    }

	    if (res != null) {
                reply("cannot create a component that already exists", 500);
                return;
            }

	    store.set(componentName, hash, type, version(major, minor, patch), function (err, res) {
                reply(err || res);
            });
	});
    };

    module.exports = Nuget;

}();
