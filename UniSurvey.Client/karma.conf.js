module.exports = function (config) {
	config.set({
		browsers: ["Chrome"],
		frameworks: ["jasmine"],
		reporters: ["spec"],
		files: [
			{ pattern: "bower_components/jquery/dist/jquery.min.js", watch: false },
			{ pattern: "bower_components/jquery-ui/jquery-ui.min.js", watch: false },
			{ pattern: "bower_components/bootstrap/dist/js/bootstrap.min.js", watch: false },
			{ pattern: "bower_components/angular/angular.min.js", watch: false },
			{ pattern: "bower_components/angular-resource/angular-resource.min.js", watch: false },
			{ pattern: "bower_components/angular-ui-router/release/angular-ui-router.min.js", watch: false },
			{ pattern: "bower_components/Chart.js/Chart.js", watch: false },
			{ pattern: "bower_components/angular-chart.js/dist/angular-chart.min.js", watch: false },
			{ pattern: "bower_components/angular-ui-sortable/sortable.min.js", watch: false },
			{ pattern: "bower_components/angular-mocks/angular-mocks.js", watch: false },
			"src/**/*.js",
			"src/**/*.spec.js"
		]
	});
};