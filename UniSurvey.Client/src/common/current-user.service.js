(function () {
	"use strict";

	angular
        .module("common.services")
        .factory("currentUser",
                  currentUser)

	function currentUser() {
		var profile = {
			isLoggedIn: false,
			username: "",
			token: "",
			isActivated: false
	};

		var setProfile = function (username, token, isLoggedIn, isActivated) {
			profile.username = username;
			profile.token = token;
			profile.isLoggedIn = isLoggedIn;
			profile.isActivated = isActivated;
		};

		var getProfile = function () {
			return profile;
		}

		return {
			setProfile: setProfile,
			getProfile: getProfile
		}
	}
})();
