var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    jshint = require('gulp-jshint');

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

gulp.task('lint', function() {
    return gulp.src('./app/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('default', ['watch']);
