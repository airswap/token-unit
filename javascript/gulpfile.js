const gulp = require('gulp')
const del = require('del')
const replace = require('gulp-replace')
const rename = require('gulp-rename')

gulp.task('build', () => {
  del.sync(['./build'])
  gulp.src('./lib/index.js')
    // Perform minification tasks, etc here
    .pipe(replace(/((\/[\.]{2}){2})\/units/g, './units'))
    .pipe(gulp.dest('./build'));
  gulp.src('./package.json')
    // Perform minification tasks, etc here
    .pipe(gulp.dest('./build'));
    gulp.src('./README.md')
      // Perform minification tasks, etc here
      .pipe(gulp.dest('./build'));
  gulp.src('./../units/*.json')
    // Perform minification tasks, etc here
    .pipe(gulp.dest('./build/units'));
})
