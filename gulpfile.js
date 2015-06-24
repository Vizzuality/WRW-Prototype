var gulp         = require('gulp');
var browserSync  = require('browser-sync').create();
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('serve', ['sass'], function() {
  browserSync.init({
    server: "./"
  });

  gulp.watch("./scss/*.scss", ['sass']);
  gulp.watch("*.html").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  var autoprefixerConfig = {
    browsers: [ 'last 2 versions', 'safari 5', 'ie 9', ],
    cascade: true
  };

  return gulp.src("./scss/*.scss")
    .pipe(sass())
    .pipe(autoprefixer(autoprefixerConfig))
    .pipe(gulp.dest("./css"))
    .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);
