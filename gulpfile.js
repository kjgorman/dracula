var gulp = require('gulp'),
    mocha = require('gulp-mocha');

var paths = {
    tests: 'test/**/*.js',
    src  : 'app/**/*.js'
};

gulp.task('tests', function () {
    return gulp.src(paths.tests, {read: false})
        .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('watch', function () {
    // re-run tests whenever we change a source file,
    // or test file
    gulp.watch(paths.tests, ['tests']);
    gulp.watch(paths.src, ['tests']);
});

gulp.task('default', ['watch']);
