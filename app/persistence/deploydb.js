!function () {
    function DeployStore (base) {
        this.base = base;
    }

    DeployStore.prototype.get = function get () {
        this.base.getVersion.apply(this, arguments);
    };

    DeployStore.prototype.find = function find(component, version, cb) {
        this.base.open(this.base.databases.versions)
            .view('versions/all', { key: component}, function (err, res) {
                if (err) { cb(err); return; }

                var result = null;

                res.some(function (el) {
                    var val = el.value;
                    if (val.version.major === version.major &&
                        val.version.minor === version.minor &&
                        val.version.patch === version.patch)
                    {
                        result = el;
                        return true; // early returns `some`
                    }

                    return false;
                });

                cb(null, result);
            });
    };

    DeployStore.prototype.deploy = function deploy (name, version, time, cb) {
        this.base.open(this.base.databases.deploys)
            .save({ name: name, version: version, time: time }, function (err, res) {
                if (err) { cb(err); return; }

                cb(null, res);
            });
    };

    module.exports = DeployStore;
}();
