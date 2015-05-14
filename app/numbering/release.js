!function () {
    function Release(store) {
        this.store = store;

        this.bundle = {
            method: 'PUT',
            path: '/release/{label}',
            handler: this.bundler.bind(this)
        };
    }

    Release.prototype.route = function route(server) {
        server.route(this.bundle);
    };

    function all (store, name, cb) {
        store.base.open(store.base.databases.deploys)
            .view('deploys/all', { key: name }, function (err, res) {
                if (err) { cb(err); return; }

                cb(null, res);
            });
    }

    function extract (request, store, cb) {
        var payload = request.payload;
        var deployables = Object.keys(payload);
        var verified = [];

        function get (current, rest) {
            all(store, current, function (err, res) {
                if (current == null) {
                    cb(null, verified);
                    return;
                }

                if (err) { cb(err); return; }
                if (res == null) { cb('unable to find: ', current); return; }

                var rev = res.filter(function (r) { return r.value._rev === payload[current]; });

                if (rev.length === 0) {
                    cb('no such component: '+ current + ' with rev: ' + payload[current]);
                    return;
                }

                verified.push(rev[0]);

                get(rest.shift(), rest);
            });
        }

        get(deployables.shift(), deployables);
    }

    Release.prototype.bundler = function bundler(request, reply) {
        var store = this.store;

        extract(request, store, function (err, deployables) {
            if (err) { reply(err); return; }

            store.set({
                label: request.params.label,
                timestamp: Date.now(),
                deployables: deployables
            }, function (err, res) {
                reply(err || res);
            });
        });
    };

    module.exports = Release;
}();
