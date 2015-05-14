!function () {

    var assert = require('chai').assert,
        Range  = require('../../app/query/range');

    function store () {
        return {
            range: function (from, to, component, cb) {
                cb(null, [
                    { time: 1431596618910, name: 'foo', hash: '8fc94592ddb187ed433c63d74bd2cc196f60758b' },
                    { time: 1431596618000, name: 'bar', hash: 'daed04e8be833feaa288a89528d95f6904b71b13' },
                    { time: 1431596618503, name: 'foo', hash: '0b48718dcb3a8842bfb6422c55980627d71608cc' },
                    { time: 1431596600278, name: 'bar', hash: '4a1cff48df19aeebfb616b09429e6e7994f67693' },
                    { time: 1431596618914, name: 'quux', hash: '3751fc9482a6816d0e8b96c750130a9971658cf1' }
                ].filter(function (d) {
                    return (d.time > (from || 0))
                        && (d.time < (to || Number.MAX_VALUE))
                        && (d.name === component || component == null);
                }));
            }
        };
    }

    describe('bounded basics', function () {
        it ('should return all deployments between two given points', function () {
            var r = new Range(store());

            r.rangeQuery({ params: { from: 1431596600277, to: 1431596618915 }}, function (response) {
                assert.equal(response.length, 5);
            });
        });

        it ('should exclude values outside of those points', function () {
            var r = new Range(store());

            r.rangeQuery({ params: { from: 1431596600279, to: 1431596618913 }}, function (response) {
                assert.equal(response.length, 3);
            });
        });

        it ('should filter to the component name, when provided', function () {
            var r = new Range(store());
            var p = { params: { from: 0, to: Number.MAX_VALUE, component: 'foo' }};

            r.rangeQuery(p, function (response) {
                assert.equal(response.length, 2);
                response.forEach(function (d) { assert.equal(d.name, 'foo'); });
            });
        });
    });
}();
