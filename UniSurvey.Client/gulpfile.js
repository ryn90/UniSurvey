var gulp = require("gulp");
var Server = require("karma").Server;
var concat = require("gulp-concat");
var clean = require("gulp-clean");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");
var minifyCSS = require("gulp-minify-css");
var autoprefixer = require("gulp-autoprefixer");
var mainBowerFiles = require("main-bower-files");

var jsdist = "dist/js";
var cssdist = "dist/css";

/**
 * Run test once and exit
 */
gulp.task("test", function (done) {
	new Server({
		configFile: __dirname + "/karma.conf.js",
		singleRun: true
	}, done).start();
});

/**
 * Watch for file changes and re-run tests on each change
 */
gulp.task("tdd", function (done) {
	new Server({
		configFile: __dirname + "/karma.conf.js"
	}, done).start();
});

gulp.task("vendor-scripts", function() {
	return gulp.src([
		"./bower_components/jquery/dist/jquery.js",
		"./bower_components/jquery-ui/jquery-ui.js",
		"./bower_components/bootstrap/dist/js/bootstrap.js",
		"./bower_components/angular/angular.js",
		"./bower_components/angular-resource/angular-resource.js",
		"./bower_components/angular-ui-router/release/angular-ui-router.js",
		"./bower_components/Chart.js/Chart.js",
		"./bower_components/angular-chart.js/dist/angular-chart.js",
		"./bower_components/angular-ui-sortable/sortable.js",
		"./node_modules/jquery-ui-touch-punch/jquery.ui.touch-punch.js"
	])
	.pipe(concat("vendors.js"))
	.pipe(gulp.dest(jsdist))
	.pipe(rename("vendors.min.js"))
	.pipe(uglify())
	.pipe(sourcemaps.write())
	.pipe(gulp.dest(jsdist));
});

gulp.task("scripts", ["vendor-scripts"], function() {
	return gulp.src([
			"./src/**/*.js",
			"!./src/**/*.spec.js"
		])
		.pipe(concat("dist.js"))
		.pipe(gulp.dest(jsdist))
		.pipe(rename("dist.min.js"))
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(jsdist));
});

gulp.task("vendor-styles", ["copy-fonts"], function () {
	return gulp.src([
			"bower_components/bootstrap/dist/css/bootstrap.css",
			"bower_components/angular-chart.js/dist/angular-chart.css"
		], { base: "bower_components/" })
		.pipe(concat("vendors.css"))
		.pipe(gulp.dest(cssdist))
		.pipe(rename("vendors.min.css"))
		.pipe(minifyCSS())
		.pipe(gulp.dest(cssdist));
});

gulp.task("styles", ["vendor-styles"], function() {
	return gulp.src("src/styles/**/*.css")
		.pipe(concat("style.css"))
		.pipe(gulp.dest(cssdist))
		.pipe(rename("style.min.css"))
		.pipe(minifyCSS())
		.pipe(autoprefixer("last 2 version", "safari 5", "ie 8", "ie 9"))
		.pipe(gulp.dest(cssdist));
});

gulp.task("clean", function () {
	return gulp.src("dist", { read: false })
        .pipe(clean());
});

gulp.task("copy-fonts", function() {
	return gulp.src("./bower_components/**/*.{eot,svg,ttf,woff,woff2}")
		.pipe(rename({ dirname: "" }))
		.pipe(gulp.dest("./dist/fonts"));
});

/**
 * Shows a list of available gulp tasks on the console when typing 'gulp'
 */
gulp.task("help", function () {
	console.log("----------------------------");
	console.log("Available Gulp Tasks: ");
	console.log("----------------------------");
	console.log("gulp test    -- runs all the jasmine unit tests once");
	console.log("gulp tdd     -- runs all the jasmine unit tests, watches for file changes and re-runs the tests on each change");
	console.log("gulp build   -- concats and minifies, scripts and styles, both for the vendor and the app dependencies");
	console.log("gulp clean   -- cleans the dist folder");
});

gulp.task("build", ["scripts", "styles"]);
gulp.task("default", ["help"]);