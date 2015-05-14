!function () {

    function Deploy(store) {
        this.store = store;

        this.deploy = {
            method: 'POST',
            path: '/deploy/{component}/{hash}',
            handler: this.deployment.bind(this)
        };
    }

    Deploy.prototype.route = function route(server) {
        server.route(this.deploy);
    };

    Deploy.prototype.deployment = function deployment(request, reply) {
        var component = request.params.component,
            hash = request.params.hash,
            store = this.store;

        store.get(component, function (err, res) {
            if (err) { cb(err); return; }

            // TODO(kjgorman): also need dependencies here
            store.deploy(component, hash, Date.now(), function (err, res) {
                reply(err || res);
            });
        });
    };

    module.exports = Deploy;
}();
