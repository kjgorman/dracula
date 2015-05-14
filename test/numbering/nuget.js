!function () {

    var assert = require('chai').assert,
	Nuget  = new require('../../app/numbering/nuget');

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
	function storeWith(component, version) {
	    return new Nuget(function (name) {
		return name === component ? version : null;
	    })
	}

	function version(major, minor, patch) {
	    return { major: major, minor: minor, patch: patch };
	}

	it ('should increment the patch version by one when asked', function () {
	    var nuget = storeWith('foo', version(1, 0, 0));

	    nuget.handler({ params: { component: 'foo', action: 'bugfix' }}, function (response) {
		assert.equal(response.major, 1);
		assert.equal(response.minor, 0);
		assert.equal(response.patch, 1);
	    });
	})

    });

}();
