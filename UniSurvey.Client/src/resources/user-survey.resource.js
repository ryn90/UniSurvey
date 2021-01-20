(function () {
	"use strict";

	angular
        .module("common.services")
        .factory("userSurveyResource",
                ["$resource",
                 "appSettings",
                    userSurveyResource])

	function userSurveyResource($resource, appSettings) {
		return {
			get: $resource(appSettings.serverPath + "/api/UserSurvey?email=:email", { email: '@email' },
			{
				"getUserSurveys": {
					method: "GET",
					isArray: true
				}
			})
		}
	}
})();
