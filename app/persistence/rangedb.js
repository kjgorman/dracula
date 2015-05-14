!function () {
    function RangeStore (base) {
        this.base = base;
    }

    RangeStore.prototype.range = function range(from, to, component, cb) {
        this.base.open(this.base.databases.deploys).view('deploys/all', function (err, res) {
            if (err) { cb(err); return; }

            cb(null, res.filter(function (d) {
                var v = d.value;
                return (v.time > (from || 0)) &&
                    (v.time < (to   || Number.MAX_VALUE)) &&
                    (v.name === component || component == null);
            }));
        });
    };

    module.exports = RangeStore;
}();
