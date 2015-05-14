!function () {

    function Range(store) {
        this.store = store;
        this.range = {
            method: 'GET',
            path: '/range/{from}/{to}/{component?}',
            handler: this.rangeQuery.bind(this)
        };

        this.from = {
            method: 'GET',
            path: '/range/from/{from}/{component?}',
            handler: this.rangeQuery.bind(this)
        };

        this.to = {
            method: 'GET',
            path: '/range/to/{to}/{component?}',
            handler: this.rangeQuery.bind(this)
        };
    }

    Range.prototype.route = function route(server) {
        server.route(this.range);
        server.route(this.from);
        server.route(this.to);
    };

    Range.prototype.rangeQuery = function rangeQuery (request, reply) {
        var from      = request.params.from,
            to        = request.params.to,
            component = request.params.component;

        this.store.range(from, to, component, function (err, res) {
            reply(err || res);
        });
    };

    module.exports = Range;
}();
