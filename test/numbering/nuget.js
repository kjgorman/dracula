!function () {

    var assert = require('chai').assert,
	nuget  = require('../../app/numbering/nuget').handler;

    describe('basics', function () {
	it ('should reply using the reply callback', function () {
	    nuget(null, function (response) {
		assert.equal(response, 'hello world');
	    });
	});
    });

}();
