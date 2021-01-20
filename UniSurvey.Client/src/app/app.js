(function () {
	"use strict";

	var app = angular.module("uniSurvey",
                            ["common.services",
								"ui.router",
								"chart.js",
								"ui.sortable"]);

	app.config(["$logProvider", "$stateProvider", "$urlRouterProvider", function ($logProvider, $stateProvider, $urlRouterProvider) {

		// todo: enabled debug for development purposes
		$logProvider.debugEnabled(true);

		// if the URL Router cannot handle the route provided, redirect to the default / 
		// $urlRouterProvider.otherwise("/");

		$stateProvider
			.state("home", {
				url: "/",
				templateUrl: "../src/templates/home.html",
				controller: "HomeController",
				controllerAs: "home"
			})
			// Admin
			.state("create-survey", {
				url: "create-survey",
				templateUrl: "../src/templates/create-survey.html",
				controller: "CreateSurveyController",
				controllerAs: "surveys"
			})
			.state("create-survey-details", {
				url: "create-survey/{id: [0-9]}", // by using the curly braces, we can make use of regex to filter the URL paramaters
				templateUrl: "../src/templates/create-survey-details.html",
				controller: "CreateSurveyDetailsController",
				controllerAs: "surveyDetails"
			})
			.state("view-results", {
				url: "view-results",
				templateUrl: "../src/templates/results.html",
				controller: "ResultsController",
				controllerAs: "results"
			})
			.state("view-results-details", {
				url: "view-results/{id: [0-9]}", // by using the curly braces, we can make use of regex to filter the URL paramaters
				templateUrl: "../src/templates/results-details.html",
				controller: "ResultsDetailsController",
				controllerAs: "resultsDetails"
			})
			// User
			.state("complete-survey", {
				url: "complete-survey",
				templateUrl: "../src/templates/complete-survey.html",
				controller: "CompleteSurveyController",
				controllerAs: "completeSurvey"
			})
			.state("complete-survey-details", {
				url: "complete-survey/{id: [0-9]}", // by using the curly braces, we can make use of regex to filter the URL paramaters
				templateUrl: "../src/templates/complete-survey-details.html",
				controller: "CompleteSurveyDetailsController",
				controllerAs: "completeSurveyDetails"
			});
	}]);

	// Below are listeners handle state events for ui-router, mainly stateChangeSuccess, stateNotFound and stateChange Error.
	// These can be helpful when things to go wrong with particular states within the web application. 
	app.run(["$rootScope", "$log", function ($rootScope, $log) {

		$rootScope.$on("$stateNotFound", function (event, unfoundState, fromState, fromParams) {
			$log.error("The requested state was not found: ", unfoundState);
		});

		$rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
			$log.error("An error occurred while changing states: ", error);
			$log.debug("event", event);
			$log.debug("toState", toState);
			$log.debug("toParams", toParams);
			$log.debug("fromState", fromState);
			$log.debug("fromParams", fromParams);
		});

	}]);
}());