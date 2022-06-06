const gulp = require('gulp');
// const sass = require('gulp-sass');
const uglifycss = require('gulp-uglifycss');
const browserSync = require('browser-sync').create();

// complie scss to css
// function style(){
// 	return gulp.src('./scss/*.scss').pipe(sass().on('error', sass.logError)).pipe(gulp.dest('./css')).pipe(browserSync.stream());
// }
// Uglify CSS
function css() {
    return gulp.src('./assets/css/*.css').pipe(uglifycss()).pipe(gulp.dest('./assets/dist/css/'));
}
// Watch
function watch() {
    browserSync.init({
        server: {
            baseDir: './',
        }
    });
    // gulp.watch('./scss/**/*.scss', style);
    gulp.watch('./assets/css/**/*.css', css);
    gulp.watch('./assets/css/**/*.css').on('change', browserSync.reload);
    gulp.watch('./*.html').on('change', browserSync.reload);
    gulp.watch('./assets/js/**/*.js').on('change', browserSync.reload);
}
// exports.style = style;
exports.css = css;
exports.watch = watch;