!function () {

    var Connection = require('cradle').Connection,
        db = open('versions');

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

    createIfNecessary('versions', db);
    createIfNecessary('releases', open('releases'));

    function getVersion (name, cb) {
        open('versions').view('versions/all', { key: name }, function (err, res) {
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

            open('versions').save(newVersion, function (err, res) {
                if (err) cb(err);
                else cb(null, res);
            });
        }
    };

    var releasePersistence = {
        get: getVersion,
        release: function (name, hash, time, cb) {
            open('releases').save({ name: name, hash: hash, time: time }, function (err, res) {
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
        release: releasePersistence
    };

}();
