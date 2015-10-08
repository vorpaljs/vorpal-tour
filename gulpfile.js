'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const changed = require('gulp-changed');

gulp.task('watch', function () {
  gulp.watch('src/**/*.js', ['babel']);
});

gulp.task('babel', function () {
  const bab = babel();
  bab.on('error', function (e) {
    console.log(e.stack);
  });
  gulp.src('src/**/*.js')
    .pipe(changed('dist'))
    .pipe(bab)
    .pipe(gulp.dest('dist'));

  return;
});

gulp.task('default', ['babel', 'watch']);
