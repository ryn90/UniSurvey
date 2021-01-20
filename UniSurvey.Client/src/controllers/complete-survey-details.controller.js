(function () {
	"use strict";
	angular
        .module("uniSurvey")
        .controller("CompleteSurveyDetailsController", ["surveyResource", "surveyQuestionResource", "surveySubmissionResource", "$stateParams", "currentUser", CompleteSurveyDetailsController]);

	function CompleteSurveyDetailsController(surveyResource, surveyQuestionResource, surveySubmissionResource, $stateParams, currentUser) {
		var completeSurveyDetails = this;
		completeSurveyDetails.surveySubmitted = false;

		completeSurveyDetails.currentSurvey = {
			id: $stateParams.id,
			title: "",
			creator: "",
			isActive: 2
		}

		completeSurveyDetails.surveySubmissionDetails = {
			surveyId: $stateParams.id,
			username: "",
			questions: []
		}

		// function which is triggered when a survey has been submitted
		completeSurveyDetails.submitSurvey = function () {
			surveySubmissionResource.submit.submitSubmission(completeSurveyDetails.surveySubmissionDetails,
				function (data) {
					completeSurveyDetails.surveySubmitted = true;
					completeSurveyDetails.messageType = "success";
					completeSurveyDetails.message = "Survey Submitted";
				},
				function (response) {
					surveyDetails.messageType = "danger";
					surveyDetails.message = response.statusText + "\r\n";
					if (response.data && response.data.exceptionMessage)
						surveyDetails.message += response.data.exceptionMessage;

					// Validation errors
					if (response.data.modelState) {
						for (var key in response.data.modelState) {
							surveyDetails.message += response.data.modelState[key] + "\r\n";
						}
					}
				});
		}

		// function to retrieve existing questions for survey
		completeSurveyDetails.getSurveyQuestions = function () {
			completeSurveyDetails.surveySubmissionDetails.questions = surveyQuestionResource.get.getSurveyQuestions({ id: $stateParams.id });
		}

		// load existing questions
		completeSurveyDetails.currentSurvey = surveyResource.get.getSurvey({ id: completeSurveyDetails.currentSurvey.id });
		completeSurveyDetails.getSurveyQuestions();
		completeSurveyDetails.surveySubmissionDetails.username = currentUser.getProfile().username;
	}
}());