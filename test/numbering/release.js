!function () {

    var assert  = require('chai').assert,
        Release = require('../../app/numbering/release');

    function store () {
        return {
            base: {
                open: function () {
                    return {
                        view: function (path, key, cb) {
                            cb(null, [
                                {
                                    value: {
                                        _rev: 1
                                    }
                                }
                            ]);
                        }
                    }
                },
                databases: {}
            },
            set: function (release, cb) {
                cb(release);
            }
        }
    }

    describe ('release basics', function () {
        it ('should set the release to have the given label', function () {
            var r = new Release(store());

            r.bundler({ params: { label: 'foo' }, payload: {}}, function (response) {
                assert.equal(response.label, 'foo');
            });
        });

        it ('should fail if it can\'t find a deployable with the given rev', function () {
            var r = new Release(store()),
                p = { params: { label: 'foo' }, payload: { 'foo' : 'bar' }};

            r.bundler(p, function (response) {
                assert.match(response, /no such component/);
            });
        });

        it ('should return the deployables for the given rev', function () {
            var r = new Release(store()),
                p = { params: { label: 'foo' }, payload: { 'foo': 1 }};

            r.bundler(p, function (response) {
                assert.isObject(response);
                assert.equal(response.deployables[0].value._rev, 1);
            });
        });
    });

}();
