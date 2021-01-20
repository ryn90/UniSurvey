(function () {
	"use strict";

	angular
        .module("common.services")
        .factory("resultResource",
                ["$resource",
                 "appSettings",
                    resultResource])

	function resultResource($resource, appSettings) {
		return {
			get: $resource(appSettings.serverPath + "/api/Result?surveyId=:surveyId", { surveyId: "@surveyId" },
			{
				"getQuestionResults": {
					method: "GET",
					isArray: true
				}
			})
		}
	}
})();
