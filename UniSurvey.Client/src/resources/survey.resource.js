(function () {
	"use strict";

	angular
        .module("common.services")
        .factory("surveyResource",
                ["$resource",
                 "appSettings",
                    surveyResource])

	function surveyResource($resource, appSettings) {
		return {
			get: $resource(appSettings.serverPath + "/api/Survey/:id", {id: "@id"},
			{
				"getSurvey": {
					method: "GET",
					isArray: false
				}
			}),
			getSurveys: $resource(appSettings.serverPath + "/api/Survey", null,
			{
				"getSurveys": {
					method: "GET",
					isArray: true
				}
			}),
			getClosedSurveys: $resource(appSettings.serverPath + "/api/ClosedSurvey", null,
			{
				"getSurveys": {
					method: "GET",
					isArray: true
				}
			}),
			save: $resource(appSettings.serverPath + "/api/Survey", null,
			{
				"saveSurvey": {
					method: "POST"
				}
			}),
			update: $resource(appSettings.serverPath + "/api/Survey", null,
			{
				"closeFeedback": {
					method: "PUT"
				}
			})
	}
	}
})();
