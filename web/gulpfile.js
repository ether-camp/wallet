var browserify = require('browserify'),
  watchify = require('watchify'),
  gulp = require('gulp'),
  source = require('vinyl-source-stream'),
  sourceFile = './src/app.js',
  destFolder = './dist/',
  destFile = 'app.js';
 
gulp.task('browserify', function() {
  return browserify(sourceFile)
    .bundle()
    .pipe(source(destFile))
    .pipe(gulp.dest(destFolder));
});

gulp.task('watch', function() {
  var bundler = browserify({
    cache: {},
    packageCache: {},
    plugin: [watchify]
  }).add(sourceFile);
  
  bundler.on('update', rebundle);
  rebundle();

  function rebundle() {
    return bundler.bundle()
      .pipe(source(destFile))
      .pipe(gulp.dest(destFolder));
  }
});


gulp.task('default', ['browserify']);