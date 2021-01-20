(function () {
	"use strict";
	angular
        .module("uniSurvey")
        .controller("ResultsDetailsController", ["$stateParams", "resultResource", "surveyResource", ResultsDetailsController]);

	function ResultsDetailsController($stateParams, resultResource, surveyResource) {

		var resultsDetails = this;
		resultsDetails.currentSurveyId = $stateParams.id;
		resultsDetails.legend = true;
		resultsDetails.isLoading = true;

		resultsDetails.survey = {
			id: 1,
			title: "",
			creator: "",
			isActive: 1
		}

		// results model
		resultsDetails.results = {
			questions: []
		}

		resultsDetails.results.questions = resultResource.get.getQuestionResults(
			{ surveyId: resultsDetails.currentSurveyId },
			function (data) {
				resultsDetails.isLoading = false;
			},
			function (response) {
				resultsDetails.messageType = "danger";
				resultsDetails.message = response.statusText + "\r\n";
				if (response.data && response.data.exceptionMessage)
					resultsDetails.message += response.data.exceptionMessage;

				// Validation errors
				if (response.data.modelState) {
					for (var key in response.data.modelState) {
						resultsDetails.message += response.data.modelState[key] + "\r\n";
					}
				}
			}
		);

		// get current survey 
		resultsDetails.getSurvey = function () {
			resultsDetails.survey = surveyResource.get.getSurvey({ id: resultsDetails.currentSurveyId });
		}

		// load current survey
		resultsDetails.getSurvey();
	}
}());