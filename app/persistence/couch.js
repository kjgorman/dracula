!function () {

    var Connection = require('cradle').Connection,
        db = new Connection().database('versions');

    var nugetPersistence = {
	get: function (name, cb) {
	    new Connection()
		.database('versions')
		.view('versions/all', { key: name }, function (err, res) {
		    if (err) cb(err);

		    cb(null, res.sort(function (a, b) {
			return a.value.timestamp < b.value.timestamp
		    })[0]);
		});
	},
	set: function (name, value) {
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
