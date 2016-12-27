var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');

var rev = require('gulp-rev');

gulp.task('css', function() {
  return gulp.src(['www/**/*.css', '!www/lib/**/*.css'])
    .pipe(rev())
    .pipe(gulp.dest('dist'))
    .pipe(rev.manifest({merge: true}))
    .pipe(gulp.dest('rev/css'));
});

gulp.task('scripts', function() {
  return gulp.src(['www/**/js/*.js', '!www/lib/**/*.js', 'www/**/src/**/*.js'])
    .pipe(rev())
    .pipe(gulp.dest('dist'))
    .pipe(rev.manifest({merge: true}))
    .pipe(gulp.dest('rev/js'));
});

gulp.task('move', function() {
  return gulp.src(['www/**/src/**/*.html'])
    .pipe(gulp.dest('dist'))
});

var revCollector = require('gulp-rev-collector');
var minifyHTML = require('gulp-minify-html');

gulp.task('rev', ['css', 'scripts', 'move'], function() {
  return gulp.src(['rev/**/*.json', 'www/index.html'])
    .pipe(revCollector({

    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('rev2', ['rev'], function() {
  return gulp.src(['rev/**/*.json', 'www/js/routes.js'])
    .pipe(revCollector())
    .pipe(gulp.dest('dist'));
});

var clean = require('gulp-clean');

gulp.task('clean', function() {
  return gulp.src(['dist', 'rev'], {read: false})
    .pipe(clean());
});

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
