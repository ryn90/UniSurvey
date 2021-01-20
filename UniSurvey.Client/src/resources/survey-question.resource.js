(function () {
	"use strict";

	angular
        .module("common.services")
        .factory("surveyQuestionResource",
                ["$resource",
                 "appSettings",
                    surveyQuestionResource])

	function surveyQuestionResource($resource, appSettings) {
		return {
			get: $resource(appSettings.serverPath + "/api/SurveyQuestions/:id", { id: "@id" },
			{
				"getSurveyQuestions": {
					method: "GET",
					isArray: true
				}
			}),
			save: $resource(appSettings.serverPath + "/api/SurveyQuestions", null,
			{
				"saveSurveyQuestions": {
					method: "POST",
					isArray: true
				}
			}),
			remove: $resource(appSettings.serverPath + "/api/SurveyQuestions/:id", { surveyId: "@surveyId", questionId: "@questionId" },
			{
				"removeQuestion": {
					method: "PUT"
				}
			})
		}
	}
})();
