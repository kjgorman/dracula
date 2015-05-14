!function () {

    var Connection = require('cradle').Connection,
        db = open();

    function open () {
        return new Connection().database('versions');
    }

    var nugetPersistence = {
        get: function (name, cb) {
            open().view('versions/all', { key: name }, function (err, res) {
                if (err) cb(err);

                cb(null, res.sort(function (a, b) {
                    return a.value.timestamp < b.value.timestamp
                })[0]);
            });
        },
        set: function (name, type, version, cb) {
            var newVersion = {
                component: name,
                version: version,
                type: type,
                timestamp: Date.now()
            }

            open().save(newVersion, function (err, res) {
                if (err) cb(err);
                else cb(null, res);
            });
        }
    }

    db.save('_design/versions', {
        all: {
            map: function (doc) {
                if (doc.component) emit(doc.component, doc);
            }
        }
    });

    module.exports = {
        nuget: nugetPersistence,
        db: db
    };

}();
