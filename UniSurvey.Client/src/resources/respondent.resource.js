(function () {
	"use strict";

	angular
        .module("common.services")
        .factory("respondentResource",
                ["$resource",
                 "appSettings",
                    respondentResource])

	function respondentResource($resource, appSettings) {
		return {

			send: $resource(appSettings.serverPath + "/api/Respondent", null,
			{
				"sendToStudents": {
					method: "POST"
				}
			})
		}
	}
})();
