(function () {
	"use strict";
	angular
        .module("uniSurvey")
        .controller("MainCtrl",
                     ["userAccountResource",
						"currentUser",
						"userRoleResource",
						"$state",
                         MainCtrl]);

	function MainCtrl(userAccount, currentUser, userRoleResource, $state) {
		var vm = this;

		vm.isUserLoggedIn = function () {
			if (currentUser.getProfile().isLoggedIn && currentUser.getProfile().isActivated) {
				return true;
			}
			return false;
		};

		// success, info, warning, danger
		vm.messageType = "info";
		vm.message = "";

		vm.userData = {
			userName: "",
			email: "",
			password: "",
			confirmPassword: "",
			accessLevel: "",
			isActivated: false,
			token: ""
		};

		// confirmation box data
		vm.showEmailConfirmationCode = false;
		vm.userConfirmation = {
			confirmationEmail: "",
			confirmationCode: ""
		}


		vm.confirmationMessageType = "info";
		vm.confirmationMessage = "";

		vm.registerUser = function () {

			// check if any input was provided
			if (!vm.userData.email || !vm.userData.password) {
				return;
			}

			vm.userData.confirmPassword = vm.userData.password;

			userAccount.registration.registerUser(vm.userData,
                function (data) {
                	vm.confirmPassword = "";
                	vm.messageType = "success";
                	vm.message = "Registration Successful! Please confirm your email by entering the code recieved " +
                		"by email within the accordian below. ";
                	vm.showEmailConfirmationCode = true;
                },
                function (response) {
                	vm.isLoggedIn = false;
                	vm.messageType = "danger";
	                vm.message = "Register Unsuccessful! Please make sure the email is not already in use and that the password is secure. ";
                });
		}

		vm.login = function () {
			// check if any input was provided
			if (!vm.userData.email || !vm.userData.password) {
				return;
			}

			vm.message = "";
			vm.userData.grant_type = "password";
			vm.userData.userName = vm.userData.email;

			userAccount.login.loginUser(vm.userData,
                function (data) {
                	vm.message = "";
                	vm.password = "";

                	vm.userData.token = data.access_token;
                	localStorage.setItem("token", data.access_token);

                	userRoleResource.get.getAccessLevel({ email: vm.userData.email },
						function (data) {
					   		// check user access level
					   		if (data.accessLevel != null) {
					   			vm.userData.accessLevel = data.accessLevel;
					   		} else { // 1 is default User Access Level
					   			vm.userData.accessLevel = 1;
					   		}
					   		// check if user is activated
					   		if (data.isActivated != null) {
					   			vm.userData.isActivated = data.isActivated;
					   		}
					   		if (data.isActivated == null || data.isActivated === false) {
					   			vm.messageType = "danger";
					   			vm.message = "Your account is not activated, please check your email and insert the confirmation code below";
					   		}

					   		$state.go("home"); // on login, take the user to the home state

					   		// set user settings
					   		currentUser.setProfile(vm.userData.userName, vm.userData.token, true, vm.userData.isActivated);
						   });
						},
						function (response) {
							vm.password = "";
							vm.messageType = "danger";
							if (response.data && response.data.error_description)
								vm.message += response.data.error_description;

							if (response.data && response.data.exceptionMessage)
								vm.message += response.data.exceptionMessage;
						}
					);
		}

		vm.logout = function () {
			currentUser.setProfile(null, null, false, false);
			localStorage.removeItem("token");
			vm.userData.token = "";
			vm.userData.isActivated = "";
			$state.go("home"); // on logout, take the user to the home state

			userAccount.logout.logoutUser(null, null, null);
		}

		vm.confirmRegistration = function () {
			// if fields are empty, prevent confirmation
			if (!vm.userConfirmation.confirmationEmail || !vm.userConfirmation.confirmationCode) {
				return;
			}

			userRoleResource.confirm.confirmRegistration(vm.userConfirmation,
				function (data) {
					vm.confirmationMessageType = "success";
					vm.confirmationMessage = "Registration Confirmed, you may now Login. ";
				},
				function (response) {
					vm.confirmationMessageType = "danger";
					vm.confirmationMessage = "Your account could not be confirmed, please check your email and / or confirmation code and try again. ";
				});
		}

		// checks whether the current state is the same as that of the menu item
		// in order to trigger the active css class. It is also handling detail pages. 
		vm.activeLink = function (state) {
			return ($state.is(state) || $state.is(state + "-details") ? "active" : "");
		}
	}
}());
