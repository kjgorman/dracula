!function () {

    var assert = require('chai').assert,
        Nuget  = new require('../../app/numbering/nuget');

    function persistentStore() {
        var store = {};

        return new Nuget({
            get: function (name) { return store[name]; },
            set: function (name, value) { return store[name] = value; }
        });
    }

    function storeWith(component, version) {
        return new Nuget({
            get: function (name, callback) {
                return callback(null, name === component ? { value: { version: version } } : null);
            },
            set: function (name, type, version, callback) {
                callback(null, version);
            }
        })
    }

    function version(major, minor, patch) {
        return { major: major, minor: minor, patch: patch };
    }

    describe('basics', function () {
        var nuget = new Nuget({
            get: function (name) {
                if (name === 'valid') return { something: 1 };

                throw new Error('attempted to find something that didn\'t exist');
            }
        });

        it ('should reply using the reply callback', function () {
            nuget.revision({ params: { component: 'valid' } }, function (response) {
                assert(response != null);
            });
        });

        it ('should lookup the component name in the given store', function () {
            nuget.revision({ params: { component: 'valid' }}, function (response) {
                assert(response != null);
            });

            assert.throws(function () {
                nuget.revision({ params: { component: 'invalid' }}, function (r) {});
            });
        });
    });

    describe('incrementing the patch version', function () {

        it ('should increment the patch version by one when asked', function () {
            var nuget = storeWith('foo', version(1, 0, 0));

            nuget.revision({ params: { component: 'foo', action: 'bugfix' }}, function (response) {
                assert.equal(response.major, 1);
                assert.equal(response.minor, 0);
                assert.equal(response.patch, 1);
            });
        })

        it ('should just give back the current version when we have an unrecognised action', function () {
            var nuget = storeWith('foo', version(1, 0, 0));

            nuget.revision({ params: { component: 'foo', action: 'what?' }}, function (response) {
                assert.equal(response.major, 1);
                assert.equal(response.minor, 0);
                assert.equal(response.patch, 0);
            })
        });
    });

    describe('incrementing the minor version', function () {
        it ('should increment the minor version by one when asked', function () {
            var nuget = storeWith('foo', version(1, 1, 0));

            nuget.revision({ params: { component: 'foo', action: 'addition' }}, function (response) {
                assert.equal(response.major, 1);
                assert.equal(response.minor, 2);
                assert.equal(response.patch, 0);
            })
        });

        it ('should zero out the patch when we increment the minor', function () {
            var nuget = storeWith('foo', version(1, 1, 5));

            nuget.revision({ params: { component: 'foo', action: 'addition' }}, function (response) {
                assert.equal(response.major, 1);
                assert.equal(response.minor, 2);
                assert.equal(response.patch, 0);
            });
        });
    });

    describe('incrementing the major version', function () {
        it ('should increment the major version by one when asked', function () {
            var nuget = storeWith('foo', version(1, 0, 0));

            nuget.revision({ params: {component: 'foo', action: 'breaking' }}, function (response) {
                assert.equal(response.major, 2);
                assert.equal(response.minor, 0);
                assert.equal(response.patch, 0);
            });
        });

        it ('should zero the minor and patch versions when it bumps major', function () {
            var nuget = storeWith('foo', version(1, 2, 3));

            nuget.revision({ params: { component: 'foo', action: 'breaking' }}, function (response) {
                assert.equal(response.major, 2);
                assert.equal(response.minor, 0);
                assert.equal(response.patch, 0);
            });
        });
    });

    describe('creating new versions', function () {
        it ('should let us create a version', function () {
            var nuget = persistentStore(),
                params = { params: { component: 'bar', major: 1, minor: 0, patch: 0 }};

            nuget.creation(params, function (response) {
                assert.equal(response.major, 1);
                assert.equal(response.minor, 0);
                assert.equal(response.patch, 0);
            });
        });

        it ('should raise an error if we try and create an existing component', function () {
            var nuget = persistentStore(),
                params = { params: { component: 'foo', major: 1, minor: 0, patch: 0 }};

            nuget.creation(params, function (response) { assert(response != null); });
            nuget.creation(params, function (response) { assert.instanceOf(Error); });
        });
    });

}();
