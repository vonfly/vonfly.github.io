var gulp = require('gulp');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');

// 压缩html
gulp.task("minhtml",function(){
	return gulp.src("public/**/*.html")
	.pipe(htmlmin())
	.pipe(gulp.dest("./public"))
});
gulp.task("test",function(){
	return gulp.src("./public/index.html")
	.pipe(htmlmin({collapseWhitespace: true}))
	.pipe(gulp.dest("./public/"))
});
gulp.task("js",function() {
    return gulp.src("./public/**/*.js")
    .pipe(uglify())
    .pipe(gulp.dest("./public/test/"));
});