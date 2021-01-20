(function () {
	"use strict";
	angular
        .module("uniSurvey")
        .controller("HomeController", ["currentUser", HomeController]);

	function HomeController(currentUser) {
		var home = this;

		home.isLoggedIn = function () {
			if (currentUser.getProfile().isLoggedIn && currentUser.getProfile().isActivated) {
				return true;
			}
			return false;
		};
	}
}());