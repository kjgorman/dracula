!function () {
    var databases = {
        versions: 'versions',
        deploys: 'deploys'
    }


    var Connection = require('cradle').Connection,
        db = open(databases.versions);

    function open (name) {
        return new Connection().database(name);
    }

    function createIfNecessary(name, db) {
        db.exists(function (err, exists) {
            if (err) throw new Error(err);

            if (exists) { console.log(name, 'present, keep going'); }
            else {
                db.create(function (err) {
                    if (err) throw new Error(err);
                });
            }
        });
    }

    createIfNecessary(databases.versions, db);
    createIfNecessary(databases.deploys, open(databases.deploys));

    function getVersion (name, cb) {
        open(databases.versions).view('versions/all', { key: name }, function (err, res) {
            if (err) cb(err);

            cb(null, res.sort(function (a, b) {
                return a.value.timestamp < b.value.timestamp;
            })[0]);
        });
    }

    var nugetPersistence = {
        get: getVersion,
        set: function (name, type, version, cb) {
            var newVersion = {
                component: name,
                version: version,
                type: type,
                timestamp: Date.now()
            };

            open(databases.versions).save(newVersion, function (err, res) {
                if (err) cb(err);
                else cb(null, res);
            });
        }
    };

    var deployPersistence = {
        get: getVersion,
        deploy: function (name, hash, time, cb) {
            open(databases.deploys).save({ name: name, hash: hash, time: time }, function (err, res) {
                if (err) { cb(err); return; }

                cb(null, res);
            });
        }
    };

    db.save('_design/versions', {
        all: {
            map: function (doc) {
                if (doc.component) emit(doc.component, doc);
            }
        }
    });

    module.exports = {
        nuget: nugetPersistence,
        deploy: deployPersistence
    };

}();
