!function () {

    function DeployStore (base) {
        this.base = base;
    }

    DeployStore.prototype.get = function get () {
        this.base.getVersion.apply(this, arguments);
    };

    DeployStore.prototype.deploy = function deploy (name, hash, time, cb) {
        this.base.open(this.base.databases.deploys)
            .save({ name: name, hash: hash, time: time }, function (err, res) {
                if (err) { cb(err); return; }

                cb(null, res);
            });
    };

    module.exports = DeployStore;
}();
