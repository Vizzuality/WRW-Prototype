var gulp         = require('gulp');
var browserSync  = require('browser-sync').create();
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var plumber      = require('gulp-plumber');
var fileinclude  = require('gulp-file-include');

gulp.task('serve', ['sass', 'fileinclude', 'copy'], function() {
  browserSync.init({
    server: "./dist"
  });

  gulp.watch("./src/scss/*.scss", ['sass']);
  gulp.watch("./src/*.html", ['fileinclude']);

  gulp.watch(["./src/css/*"], ['copycss']);
  gulp.watch(["./src/img/**/*"], ['copyimg']);
  gulp.watch(["./src/js/**/*"], ['copyjs']);

  gulp.watch(["./src/*.html", "./src/scss/*.scss"]).on('change', browserSync.reload);
});

gulp.task('copy', ['copycss', 'copyimg', 'copyjs']);

gulp.task('copycss', function() {
  gulp.src('./src/css/**/*').pipe(gulp.dest('dist/css/'))
});

gulp.task('copyimg', function() {
  gulp.src('./src/img/**/*').pipe(gulp.dest('dist/img/'))
});

gulp.task('copyjs', function() {
  gulp.src('./src/js/**/*').pipe(gulp.dest('dist/js/'))
});

gulp.task('fileinclude', function() {
  gulp.src(['./src/*.html'])
    .pipe(plumber({
      errorHandler: function(err) {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./dist'));
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  var autoprefixerConfig = {
    browsers: [ 'last 2 versions', 'safari 5', 'ie 9', ],
    cascade: true
  };

  return gulp.src("./src/scss/*.scss")
    .pipe(plumber({
      errorHandler: function(err) {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe(sass())
    .pipe(autoprefixer(autoprefixerConfig))
    .pipe(gulp.dest("./dist/css"));
    // .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);
