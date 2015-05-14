!function () {

    function NugetStore(base) {
        this.base = base;
    }

    NugetStore.prototype.get = function get() {
        this.getVersion.apply(this, arguments);
    };

    NugetStore.prototype.set = function set (name, hash, type, version, cb) {
        var newVersion = {
            component: name,
            version: version,
            hash: hash,
            type: type,
            timestamp: Date.now()
        };

        this.base
            .open(this.base.databases.versions)
            .save(newVersion, cb);
    };

    NugetStore.prototype.getVersion = function getVersion (name, cb) {
        this.base
            .open(this.base.databases.versions).view('versions/all', { key: name }, function (err, res) {
                if (err) { cb(err); return; }

                cb(null, res.sort(function (a, b) {
                    return a.value.timestamp < b.value.timestamp;
                })[0]);
            });
    };

    module.exports = NugetStore;
}();
