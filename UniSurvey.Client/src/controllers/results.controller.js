(function () {
	"use strict";
	angular
        .module("uniSurvey")
        .controller("ResultsController", ["surveyResource", ResultsController]);

	function ResultsController(surveyResource) {
		var results = this;

		results.closedSurveys = [];
		results.closedSurveys = surveyResource.getClosedSurveys.getSurveys();
	}
}());