!function () {

    var assert = require('chai').assert,
	Nuget  = new require('../../app/numbering/nuget');

    function storeWith(component, version) {
	return new Nuget(function (name) {
	    return name === component ? version : null;
	})
    }

    function version(major, minor, patch) {
	return { major: major, minor: minor, patch: patch };
    }

    describe('basics', function () {
	var nuget = new Nuget(function (name) {
	    if (name === 'valid') return { something: 1 };

	    throw new Error('attempted to find something that didn\'t exist');
	});

	it ('should reply using the reply callback', function () {
	    nuget.handler({ params: { component: 'valid' } }, function (response) {
		assert(response != null);
	    });
	});

	it ('should lookup the component name in the given store', function () {
	    nuget.handler({ params: { component: 'valid' }}, function (response) {
		assert(response != null);
	    });

	    assert.throws(function () {
		nuget.handler({ params: { component: 'invalid' }}, function (r) {});
	    });
	});
    });

    describe('incrementing the patch version', function () {

	it ('should increment the patch version by one when asked', function () {
	    var nuget = storeWith('foo', version(1, 0, 0));

	    nuget.handler({ params: { component: 'foo', action: 'bugfix' }}, function (response) {
		assert.equal(response.major, 1);
		assert.equal(response.minor, 0);
		assert.equal(response.patch, 1);
	    });
	})

	it ('should just give back the current version when we have an unrecognised action', function () {
	    var nuget = storeWith('foo', version(1, 0, 0));

	    nuget.handler({ params: { component: 'foo', action: 'what?' }}, function (response) {
		assert.equal(response.major, 1);
		assert.equal(response.minor, 0);
		assert.equal(response.patch, 0);
	    })
	});
    });

    describe('incrementing the minor version', function () {
	it ('should increment the minor version by one when asked', function () {
	    var nuget = storeWith('foo', version(1, 1, 0));

	    nuget.handler({ params: { component: 'foo', action: 'addition' }}, function (response) {
		assert.equal(response.major, 1);
		assert.equal(response.minor, 2);
		assert.equal(response.patch, 0);
	    })
	});

	it ('should zero out the patch when we increment the minor', function () {
	    var nuget = storeWith('foo', version(1, 1, 5));

	    nuget.handler({ params: { component: 'foo', action: 'addition' }}, function (response) {
		assert.equal(response.major, 1);
		assert.equal(response.minor, 2);
		assert.equal(response.patch, 0);
	    });
	});
    });

    describe('incrementing the major version', function () {
	it ('should increment the major version by one when asked', function () {
	    var nuget = storeWith('foo', version(1, 0, 0));

	    nuget.handler({ params: {component: 'foo', action: 'breaking' }}, function (response) {
		assert.equal(response.major, 2);
		assert.equal(response.minor, 0);
		assert.equal(response.patch, 0);
	    });
	});

	it ('should zero the minor and patch versions when it bumps major', function () {
	    var nuget = storeWith('foo', version(1, 2, 3));

	    nuget.handler({ params: { component: 'foo', action: 'breaking' }}, function (response) {
		assert.equal(response.major, 2);
		assert.equal(response.minor, 0);
		assert.equal(response.patch, 0);
	    });
	});
    });

}();
