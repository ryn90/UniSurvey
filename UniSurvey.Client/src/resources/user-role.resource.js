(function () {
	"use strict";

	angular
        .module("common.services")
        .factory("userRoleResource",
                ["$resource",
                 "appSettings",
                    userRoleResource])

	function userRoleResource($resource, appSettings) {
	return {
		get: $resource(appSettings.serverPath + "/api/UserRole?email=:email", { email: '@email' },
		{
			getAccessLevel: {
				method: "GET",
				isArray: false
			}
		}),
		confirm: $resource(appSettings.serverPath + "/api/UserRole", null,
		{
			confirmRegistration: {
				method: "PUT"
			}
		})
	}
}
})();