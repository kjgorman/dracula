!function () {

    function Deploy(store) {
        this.store = store;

        this.latest = {
            method: 'POST',
            path: '/deploy/{component}',
            handler: this.latestVersion.bind(this)
        };

        this.specific = {
            method: 'POST',
            path: '/deploy/{component}/{major}/{minor}/{patch}',
            handler: this.specificVersion.bind(this)
        };
    }

    Deploy.prototype.route = function route(server) {
        server.route(this.latest);
        server.route(this.specific);
    };

    Deploy.prototype.specificVersion = function specificVersion (request, reply) {
        var component = request.params.component,
            major = +request.params.major,
            minor = +request.params.minor,
            patch = +request.params.patch,
            store = this.store;

        store.find(component, { major: major, minor: minor, patch: patch }, function (err, res) {
            if (err) { reply(err); return; }
            if (res == null) {
                reply('couldn\'t find: ', major, minor, patch);
                return;
            }

            deploy(store, res, reply, component);
        });
    };

    Deploy.prototype.latestVersion = function latestVersion (request, reply) {
        var component = request.params.component,
            store = this.store;

        store.get(component, function (err, res) {
            if (err) { reply(err); return; }

            deploy(store, res, reply, component);
        });
    };

    function deploy (store, res, reply, component) {
        if (res.value.type !== 'deployable') {
            reply('cannot deploy something that is not <type:deployable>');
            return;
        }

        // TODO(kjgorman): also need dependencies here
        store.deploy(component, res.value.version, Date.now(), function (err, res) {
            reply(err || res);
        });
    }

    module.exports = Deploy;
}();
