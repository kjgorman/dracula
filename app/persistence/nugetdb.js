!function () {

    function NugetStore(base) {
        this.base = base;
    }

    NugetStore.prototype.get = function get() {
        this.base.getVersion.apply(this, arguments);
    };

    NugetStore.prototype.set = function set (name, hash, type, version, cb) {
        var newVersion = {
            component: name,
            version: version,
            hash: hash,
            type: type,
            timestamp: Date.now()
        };

        this.base.open(this.base.databases.versions).save(newVersion, function (err, res) {
            if (err) cb(err);
            else cb(null, res);
        });
    };

    module.exports = NugetStore;
}();
