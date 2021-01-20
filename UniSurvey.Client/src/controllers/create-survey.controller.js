(function () {
	"use strict";
	angular
        .module("uniSurvey")
        .controller("CreateSurveyController", ["surveyResource", "currentUser", CreateSurveyController]);

	function CreateSurveyController(surveyResource, currentUser) {
		var surveys = this;

		surveys.survey = {
			id: 1,
			title: "",
			creator: "",
			isActive: 1
		}

		surveys.activeSurveys = [];

		surveys.getSurveys = function() {
			var activeSurveys = surveyResource.getSurveys.getSurveys();
			return activeSurveys;
		}

		surveys.createSurvey = function () {
			// check if any input was provided
			if (!surveys.survey.title) {
				return;
			};

			var currentUserInstance = currentUser.getProfile();
			surveys.survey.creator = currentUserInstance.username;
			
			surveyResource.save.saveSurvey(surveys.survey, 
				function (data) {
					// clear current object upon enter
					surveys.survey.title = "";

					// show message
					surveys.messageType = "success";
					surveys.message = "Survey Created";

					// retrieve updated list of objects. Could not use data binding 
					// since the ID is an auto number and is only known at the DB
					surveys.activeSurveys = surveys.getSurveys();
				}, 
				function(response) {
					surveys.messageType = "danger";
					surveys.message = response.statusText + "\r\n";
					if (response.data && response.data.exceptionMessage)
						surveys.message += response.data.exceptionMessage;

					// Validation errors
					if (response.data.modelState) {
						for (var key in response.data.modelState) {
							surveys.message += response.data.modelState[key] + "\r\n";
						}
					}
				});
		}

		surveys.closeSurvey = function(surveyId) {
			surveys.survey.id = surveyId;
			surveys.survey.isActive = 2;

			surveyResource.update.closeFeedback(surveys.survey,
				function (data) {
					// clear current object upon enter
					surveys.survey.title = "";

					// show message
					surveys.messageType = "success";
					surveys.message = "Survey Closed";

					surveys.activeSurveys = surveys.getSurveys();
				},
				function (response) {
					surveys.messageType = "danger";
					surveys.message = response.statusText + "\r\n";
					if (response.data && response.data.exceptionMessage)
						surveys.message += response.data.exceptionMessage;

					// Validation errors
					if (response.data.modelState) {
						for (var key in response.data.modelState) {
							surveys.message += response.data.modelState[key] + "\r\n";
						}
					}
				});
		}

		// on load, get surveys
		surveys.activeSurveys = surveys.getSurveys();
	}
}());