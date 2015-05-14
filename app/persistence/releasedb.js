!function () {

    function ReleaseStore(base) {
        this.base = base;
    }

    ReleaseStore.prototype.set = function set(release, cb) {
        this.base
            .open(this.base.databases.releases)
            .save(release, cb);
    };

    module.exports = ReleaseStore;
}();
