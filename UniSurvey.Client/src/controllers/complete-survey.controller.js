(function () {
	"use strict";
	angular
        .module("uniSurvey")
        .controller("CompleteSurveyController", ["userSurveyResource", "currentUser", CompleteSurveyController]);

	function CompleteSurveyController(userSurveyResource, currentUser) {
		var completeSurvey = this;

		completeSurvey.availableSurveys = [];

		var availableSurveys = userSurveyResource.get.getUserSurveys({ email: currentUser.getProfile().username });
		completeSurvey.availableSurveys = availableSurveys;
	}
}());