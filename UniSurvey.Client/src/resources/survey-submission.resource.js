(function () {
	"use strict";

	angular
        .module("common.services")
        .factory("surveySubmissionResource",
                ["$resource",
                 "appSettings",
                    surveySubmissionResource])

	function surveySubmissionResource($resource, appSettings) {
		return {

			submit: $resource(appSettings.serverPath + "/api/SurveySubmission", null,
			{
				"submitSubmission": {
					method: "POST"
				}
			})
		}
	}
})();
