!function () {
    var Connection = require('cradle').Connection;
    var NugetStore = require('./nugetdb');
    var DeployStore = require('./deploydb');

    var databases = {
        versions: 'versions',
        deploys: 'deploys'
    };

    var base = { open: open, databases: databases, getVersion: getVersion }

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

    createIfNecessary(databases.versions, open(databases.versions));
    createIfNecessary(databases.deploys, open(databases.deploys));

    function getVersion (name, cb) {
        open(databases.versions).view('versions/all', { key: name }, function (err, res) {
            if (err) cb(err);

            cb(null, res.sort(function (a, b) {
                return a.value.timestamp < b.value.timestamp;
            })[0]);
        });
    }

    open(databases.versions).save('_design/versions', {
        all: {
            map: function (doc) {
                if (doc.component) emit(doc.component, doc);
            }
        }
    });

    module.exports = {
        nuget: new NugetStore(base),
        deploy: new DeployStore(base)
    };

}();
