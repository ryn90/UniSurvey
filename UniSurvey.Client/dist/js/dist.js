(function () {
	"use strict";

	var app = angular.module("uniSurvey",
                            ["common.services",
								"ui.router",
								"chart.js",
								"ui.sortable"]);

	app.config(["$logProvider", "$stateProvider", "$urlRouterProvider", function ($logProvider, $stateProvider, $urlRouterProvider) {

		// todo: enabled debug for development purposes
		$logProvider.debugEnabled(true);

		// if the URL Router cannot handle the route provided, redirect to the default / 
		// $urlRouterProvider.otherwise("/");

		$stateProvider
			.state("home", {
				url: "/",
				templateUrl: "../src/templates/home.html",
				controller: "HomeController",
				controllerAs: "home"
			})
			// Admin
			.state("create-survey", {
				url: "create-survey",
				templateUrl: "../src/templates/create-survey.html",
				controller: "CreateSurveyController",
				controllerAs: "surveys"
			})
			.state("create-survey-details", {
				url: "create-survey/{id: [0-9]}", // by using the curly braces, we can make use of regex to filter the URL paramaters
				templateUrl: "../src/templates/create-survey-details.html",
				controller: "CreateSurveyDetailsController",
				controllerAs: "surveyDetails"
			})
			.state("view-results", {
				url: "view-results",
				templateUrl: "../src/templates/results.html",
				controller: "ResultsController",
				controllerAs: "results"
			})
			.state("view-results-details", {
				url: "view-results/{id: [0-9]}", // by using the curly braces, we can make use of regex to filter the URL paramaters
				templateUrl: "../src/templates/results-details.html",
				controller: "ResultsDetailsController",
				controllerAs: "resultsDetails"
			})
			// User
			.state("complete-survey", {
				url: "complete-survey",
				templateUrl: "../src/templates/complete-survey.html",
				controller: "CompleteSurveyController",
				controllerAs: "completeSurvey"
			})
			.state("complete-survey-details", {
				url: "complete-survey/{id: [0-9]}", // by using the curly braces, we can make use of regex to filter the URL paramaters
				templateUrl: "../src/templates/complete-survey-details.html",
				controller: "CompleteSurveyDetailsController",
				controllerAs: "completeSurveyDetails"
			});
	}]);

	// Below are listeners handle state events for ui-router, mainly stateChangeSuccess, stateNotFound and stateChange Error.
	// These can be helpful when things to go wrong with particular states within the web application. 
	app.run(["$rootScope", "$log", function ($rootScope, $log) {

		$rootScope.$on("$stateNotFound", function (event, unfoundState, fromState, fromParams) {
			$log.error("The requested state was not found: ", unfoundState);
		});

		$rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
			$log.error("An error occurred while changing states: ", error);
			$log.debug("event", event);
			$log.debug("toState", toState);
			$log.debug("toParams", toParams);
			$log.debug("fromState", fromState);
			$log.debug("fromParams", fromParams);
		});

	}]);
}());
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
	                vm.message = "Register Unsuccessful! Please make sure the email is not already in use. ";
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

(function () {
	"use strict";

	angular
        .module("common.services",
                    ["ngResource"])
    	.constant("appSettings",
        {
			// todo: replace with Azure WebAPI Path for Production Use
        	serverPath: "http://localhost:51608"
        	// serverPath: "http://unisurveywebapi.azurewebsites.net"
        });
}());

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

(function () {
	"use strict";
	angular
        .module("uniSurvey")
        .controller("CompleteSurveyDetailsController", ["surveyResource", "surveyQuestionResource", "surveySubmissionResource", "$stateParams", "currentUser", CompleteSurveyDetailsController]);

	function CompleteSurveyDetailsController(surveyResource, surveyQuestionResource, surveySubmissionResource, $stateParams, currentUser) {
		var completeSurveyDetails = this;
		completeSurveyDetails.surveySubmitted = false;

		completeSurveyDetails.currentSurvey = {
			id: $stateParams.id,
			title: "",
			creator: "",
			isActive: 2
		}

		completeSurveyDetails.surveySubmissionDetails = {
			surveyId: $stateParams.id,
			username: "",
			questions: []
		}

		// function which is triggered when a survey has been submitted
		completeSurveyDetails.submitSurvey = function () {
			surveySubmissionResource.submit.submitSubmission(completeSurveyDetails.surveySubmissionDetails,
				function (data) {
					completeSurveyDetails.surveySubmitted = true;
					completeSurveyDetails.messageType = "success";
					completeSurveyDetails.message = "Survey Submitted";
				},
				function (response) {
					surveyDetails.messageType = "danger";
					surveyDetails.message = response.statusText + "\r\n";
					if (response.data && response.data.exceptionMessage)
						surveyDetails.message += response.data.exceptionMessage;

					// Validation errors
					if (response.data.modelState) {
						for (var key in response.data.modelState) {
							surveyDetails.message += response.data.modelState[key] + "\r\n";
						}
					}
				});
		}

		// function to retrieve existing questions for survey
		completeSurveyDetails.getSurveyQuestions = function () {
			completeSurveyDetails.surveySubmissionDetails.questions = surveyQuestionResource.get.getSurveyQuestions({ id: $stateParams.id });
		}

		// load existing questions
		completeSurveyDetails.currentSurvey = surveyResource.get.getSurvey({ id: completeSurveyDetails.currentSurvey.id });
		completeSurveyDetails.getSurveyQuestions();
		completeSurveyDetails.surveySubmissionDetails.username = currentUser.getProfile().username;
	}
}());
(function () {
	"use strict";
	angular
        .module("uniSurvey")
        .controller("CompleteSurveyController", ["userSurveyResource", "currentUser", CompleteSurveyController]);

	function CompleteSurveyController(userSurveyResource, currentUser) {
		var completeSurvey = this;

		completeSurvey.availableSurveys = [];

		var availableSurveys = userSurveyResource.get.getUserSurveys({ email: currentUser.getProfile().username });
		completeSurvey.availableSurveys = availableSurveys;
	}
}());
(function () {
	"use strict";
	angular
        .module("uniSurvey")
        .controller("CreateSurveyDetailsController",
			["$stateParams",
				"surveyResource",
				"respondentResource",
				"surveyQuestionResource",
				CreateSurveyDetailsController]);

	function CreateSurveyDetailsController($stateParams, surveyResource, respondentResource, surveyQuestionResource) {
		var surveyDetails = this;

		// models
		surveyDetails.currentSurveyId = $stateParams.id;
		surveyDetails.studentEmails = "";
		surveyDetails.surveyDetails = {
			surveyId: surveyDetails.currentSurveyId,
			respondents: [""]
		};

		surveyDetails.survey = {
			id: 1,
			title: "",
			creator: "",
			isActive: 1
		}

		surveyDetails.existingSurveys = {
			surveys: [],
			selectedSurveyId: 0,
			hasBeenCopied: false
		};

		// questions models
		surveyDetails.questionId = 0;
		surveyDetails.surveyQuestions = {
			surveyId: surveyDetails.currentSurveyId,
			questions: []
		};

		// question types
		surveyDetails.questionTypes = [
			{
				name: "textfield",
				value: "Text Field"
			},
			{
				name: "textarea",
				value: "Text Area"
			},
			{
				name: "dropdown",
				value: "Dropdown List"
			},
			{
				name: "radio",
				value: "Radio Buttons"
			}
		];
		surveyDetails.newQuestionType = surveyDetails.questionTypes[0].name;

		// add questions to survey functions
		surveyDetails.addQuestion = function () {
			surveyDetails.questionId++;

			var question = {
				id: surveyDetails.questionId,
				surveyId: surveyDetails.currentSurveyId,
				sortOrder: surveyDetails.questionId,
				title: "Question - " + surveyDetails.questionId,
				type: surveyDetails.newQuestionType,
				value: "",
				isRequired: true,
				options: [],
				isNew: true
			};

			surveyDetails.surveyQuestions.questions.push(question);
		}

		// function to remove added questions
		surveyDetails.removeQuestion = function (questionId) {
			surveyDetails.questionsMessage = "";

			for (var i = 0; i < surveyDetails.surveyQuestions.questions.length; i++) {
				if (surveyDetails.surveyQuestions.questions[i].id === questionId) {
					if (!surveyDetails.surveyQuestions.questions[i].isNew) {
						surveyQuestionResource.remove.removeQuestion
							({
								surveyId: surveyDetails.surveyQuestions.questions[i].surveyId,
								questionId: surveyDetails.surveyQuestions.questions[i].id
							});
					}
					surveyDetails.surveyQuestions.questions.splice(i, 1);
					break;
				}
			}
		}

		// function to add options
		// also handling adding an option when there are already options
		surveyDetails.addOption = function (questionId) {
			var lastOptionId = 0;
			var matchedIndex = -1;

			for (var i = 0; i < surveyDetails.surveyQuestions.questions.length; i++) {
				if (surveyDetails.surveyQuestions.questions[i].id === questionId) {
					matchedIndex = i;
					if (surveyDetails.surveyQuestions.questions[i].options.length === 0) {
						lastOptionId = 1;
					} else {
						lastOptionId =
							surveyDetails.surveyQuestions.questions[i].options[surveyDetails.surveyQuestions.questions[i].options.length - 1].id + 1;
					}
					break;
				}
			}

			var optionId = lastOptionId;

			var option = {
				id: optionId,
				title: "Option " + optionId,
				value: optionId
			}

			if (matchedIndex !== -1) {
				surveyDetails.surveyQuestions.questions[matchedIndex].options.push(option);
			}
		}

		// function checks whether this field should have options or not
		surveyDetails.questionTypeHasOptions = function (questionType) {
			if (questionType === "radio" || questionType === "dropdown") {
				return true;
			} else {
				return false;
			}
		}

		// function to retrieve existing questions for survey
		surveyDetails.getExistingQuestions = function () {
			surveyDetails.surveyQuestions.questions = surveyQuestionResource.get.getSurveyQuestions({ id: surveyDetails.currentSurveyId });
		}

		// function checks whether the question titles and options are valid
		surveyDetails.hasValidTitles = function () {
			for (var i = 0; i < surveyDetails.surveyQuestions.questions.length; i++) {
				if (!surveyDetails.surveyQuestions.questions[i].title) {
					return false;
				} else {
					for (var j = 0; j < surveyDetails.surveyQuestions.questions[i].options.length; j++) {
						if (!surveyDetails.surveyQuestions.questions[i].options[j].title) {
							return false;
						}
					}
				}
			}
			return true;
		}

		// function which updates question's sort order
		surveyDetails.updateSortOrder = function () {
			for (var i = 0; i < surveyDetails.surveyQuestions.questions.length; i++) {
				surveyDetails.surveyQuestions.questions[i].sortOrder = i + 1;
			}
		}

		// checks whether the survey is editable, given it's current status
		surveyDetails.isSurveyEditable = function (statusCode) {
			if (statusCode === 1) {
				return true;
			}
			return false;
		}

		// function to save questions and options to the backend when the user saves
		surveyDetails.saveQuestions = function () {
			surveyDetails.questionsMessageType = "";
			surveyDetails.questionsMessage = "";
			surveyDetails.copyQuestionsMessage = "";

			// check if questions were added
			if (surveyDetails.surveyQuestions.questions.length <= 0) {
				surveyDetails.questionsMessageType = "danger";
				surveyDetails.questionsMessage =
					"Please add questions before attempting to save";
				return;
			};

			// check for empty titles
			if (!surveyDetails.hasValidTitles()) {
				surveyDetails.questionsMessageType = "danger";
				surveyDetails.questionsMessage =
					"Please add valid question titles and / or options before attempting to save";
				return;
			}

			// update question's sort order
			surveyDetails.updateSortOrder();

			if (surveyDetails.areOptionsValid()) {
				surveyQuestionResource.save.saveSurveyQuestions(surveyDetails.surveyQuestions.questions,
				function (data) {
					surveyDetails.surveyQuestions.questions = data;
					surveyDetails.questionsMessageType = "success";
					surveyDetails.questionsMessage = "Questions Added and / or Modified";
				},
				function (response) {
					surveyDetails.questionsMessageType = "danger";
					surveyDetails.questionsMessage = response.statusText + "\r\n";
					if (response.data && response.data.exceptionMessage)
						surveyDetails.questionsMessage += response.data.exceptionMessage;

					// Validation errors
					if (response.data.modelState) {
						for (var key in response.data.modelState) {
							surveyDetails.questionsMessage += response.data.modelState[key] + "\r\n";
						}
					}
				});
			}
		}

		// check if any must have options questions have options
		surveyDetails.areOptionsValid = function () {
			for (var i = 0; i < surveyDetails.surveyQuestions.questions.length; i++) {
				if (surveyDetails.surveyQuestions.questions[i].options.length === 0) {
					var shouldHaveOptions = surveyDetails.questionTypeHasOptions(surveyDetails.surveyQuestions.questions[i].type);
					if (shouldHaveOptions) {
						surveyDetails.questionsMessageType = "danger";
						surveyDetails.questionsMessage =
							"Please add options to Radio Buttons or Dropdown questions before attempting to save";
						return false;
					}
				}
			}
			return true;
		}

		// send survey to students functions
		surveyDetails.convertEmailsToEmailList = function (emails) {
			var emailList = emails.split(",");
			return emailList;
		}

		// trim empty spaces which may occur when splitting
		surveyDetails.trimEmails = function (emailList) {
			for (var i = 0; i < emailList.length; i++) {
				emailList[i] = emailList[i].trim();
			}

			return emailList;
		}

		surveyDetails.validateEmail = function (email) {
			var re = /\S+@\S+\.\S+/;
			return re.test(email);
		}

		surveyDetails.hasNewQuestions = function () {
			for (var i = 0; i < surveyDetails.surveyQuestions.questions.length; i++) {
				if (surveyDetails.surveyQuestions.questions[i].isNew) {
					return true;
				}
			}
			return false;
		}

		surveyDetails.sendToStudents = function () {
			surveyDetails.message = "";
			surveyDetails.copyQuestionsMessage = "";

			// check if the survey has questions
			if (surveyDetails.surveyQuestions.questions.length <= 0) {
				surveyDetails.messageType = "danger";
				surveyDetails.message =
					"Please make sure a survey has saved questions before attempting to send to students";
				return;
			}

			// check for in progress questions
			if (surveyDetails.hasNewQuestions()) {
				surveyDetails.messageType = "danger";
				surveyDetails.message =
					"Please save your Survey Questions or remove any new questions which were added since no updates to surveys " +
					"will be allowed once the survey has been sent";
				return;
			}

			// convert emails to list
			surveyDetails.surveyDetails.respondents = surveyDetails.convertEmailsToEmailList(surveyDetails.studentEmails);
			surveyDetails.surveyDetails.respondents = surveyDetails.trimEmails(surveyDetails.surveyDetails.respondents);

			// validate emails
			for (var i = 0; i < surveyDetails.surveyDetails.respondents.length; i++) {
				var isEmailValid = surveyDetails.validateEmail(surveyDetails.surveyDetails.respondents[i]);
				if (!isEmailValid) {
					surveyDetails.messageType = "danger";
					surveyDetails.message = "One or more email address is invalid";
					return;
				}
			}

			// POST to API
			respondentResource.send.sendToStudents(surveyDetails.surveyDetails,
				function (data) {
					surveyDetails.messageType = "success";
					surveyDetails.message = "Sent to Students";
					surveyDetails.survey.isActive = 0;
					surveyDetails.sortableOptions.disabled = !surveyDetails.isSurveyEditable(surveyDetails.survey.isActivee);
				},
				function (response) {
					surveyDetails.messageType = "danger";
					surveyDetails.message = response.statusText + "\r\n";
					if (response.data && response.data.exceptionMessage)
						surveyDetails.message += response.data.exceptionMessage;

					// Validation errors
					if (response.data.modelState) {
						for (var key in response.data.modelState) {
							surveyDetails.message += response.data.modelState[key] + "\r\n";
						}
					}
				});
		}

		// copy survey questions from another survey
		surveyDetails.copyQuestions = function () {
			var existingQuestions = surveyQuestionResource.get.getSurveyQuestions({ id: surveyDetails.existingSurveys.selectedSurveyId });

			// handle promise success
			existingQuestions.$promise.then(function (questions) {
				// replace the question's survey ID to the current one when it is copied
				// and set question as isTrue, so that it will be added instead of edited to the DB
				for (var i = 0; i < questions.length; i++) {
					questions[i].surveyId = surveyDetails.currentSurveyId;
					questions[i].isNew = true;
				}

				// push retrieved questions to the existing list of questions
				surveyDetails.surveyQuestions.questions.push.apply(surveyDetails.surveyQuestions.questions, questions);
				surveyDetails.surveyQuestions.hasBeenCopied = true;

				if (questions.length > 0) {
					surveyDetails.copyQuestionsMessageType = "success";
					surveyDetails.copyQuestionsMessage = questions.length + " questions have been copied. You may now edit the " +
						" questions, remove any questions, add more questions and edit the sort order. Remember to press save when done. ";
				}
			}, function() { // handle promise reject
				surveyDetails.copyQuestionsMessageType = "danger";
				surveyDetails.copyQuestionsMessage = "No questions were copied, the selected questionnaire may not have any saved questions. ";
			});
		}

		// get current survey 
		surveyDetails.getSurvey = function () {
			var existingSurveyPromise = surveyResource.get.getSurvey({ id: surveyDetails.currentSurveyId });
			// handle promise success
			existingSurveyPromise.$promise.then(function (survey) {
				surveyDetails.survey = survey;

				// if survey is not editable, disable the sorting option
				surveyDetails.sortableOptions.disabled = !surveyDetails.isSurveyEditable(survey.isActive);
			});
		}

		// get existing surveys
		surveyDetails.getSurveys = function () {
			// get all existing surveys
			var existingSurveysPromise = surveyResource.getSurveys.getSurveys();

			// handle promise success
			existingSurveysPromise.$promise.then(function (existingSurveys) {
				// remove existing survey from the list of surveys to copy questions from
				// as we do not want the user to copy from the same survey
				for (var i = 0; i < existingSurveys.length; i++) {
					// the plus sign '+' converts a string into an int in JavaScript
					if (existingSurveys[i].id === +surveyDetails.currentSurveyId) {
						existingSurveys.splice(i, 1);
					}
				}
				// bind surveys with retrieved surveys
				surveyDetails.existingSurveys.surveys = existingSurveys;
				// bind the first survey to the default selected survey
				surveyDetails.existingSurveys.selectedSurveyId = surveyDetails.existingSurveys.surveys[0].id;
			});
		}

		// load current survey
		surveyDetails.getSurvey();

		// load existing questions
		surveyDetails.getExistingQuestions();

		// load existing surveys
		surveyDetails.getSurveys();

		// ui-sortable configuration
		surveyDetails.sortableOptions = {
			disabled: false
		}
	}
}());
(function () {
	"use strict";
	angular
        .module("uniSurvey")
        .controller("CreateSurveyController", ["surveyResource", "currentUser", CreateSurveyController]);

	function CreateSurveyController(surveyResource, currentUser) {
		var surveys = this;

		surveys.survey = {
			id: 1,
			title: "",
			creator: "",
			isActive: 1
		}

		surveys.activeSurveys = [];

		surveys.getSurveys = function() {
			var activeSurveys = surveyResource.getSurveys.getSurveys();
			return activeSurveys;
		}

		surveys.createSurvey = function () {
			// check if any input was provided
			if (!surveys.survey.title) {
				return;
			};

			var currentUserInstance = currentUser.getProfile();
			surveys.survey.creator = currentUserInstance.username;
			
			surveyResource.save.saveSurvey(surveys.survey, 
				function (data) {
					// clear current object upon enter
					surveys.survey.title = "";

					// show message
					surveys.messageType = "success";
					surveys.message = "Survey Created";

					// retrieve updated list of objects. Could not use data binding 
					// since the ID is an auto number and is only known at the DB
					surveys.activeSurveys = surveys.getSurveys();
				}, 
				function(response) {
					surveys.messageType = "danger";
					surveys.message = response.statusText + "\r\n";
					if (response.data && response.data.exceptionMessage)
						surveys.message += response.data.exceptionMessage;

					// Validation errors
					if (response.data.modelState) {
						for (var key in response.data.modelState) {
							surveys.message += response.data.modelState[key] + "\r\n";
						}
					}
				});
		}

		surveys.closeSurvey = function(surveyId) {
			surveys.survey.id = surveyId;
			surveys.survey.isActive = 2;

			surveyResource.update.closeFeedback(surveys.survey,
				function (data) {
					// clear current object upon enter
					surveys.survey.title = "";

					// show message
					surveys.messageType = "success";
					surveys.message = "Survey Closed";

					surveys.activeSurveys = surveys.getSurveys();
				},
				function (response) {
					surveys.messageType = "danger";
					surveys.message = response.statusText + "\r\n";
					if (response.data && response.data.exceptionMessage)
						surveys.message += response.data.exceptionMessage;

					// Validation errors
					if (response.data.modelState) {
						for (var key in response.data.modelState) {
							surveys.message += response.data.modelState[key] + "\r\n";
						}
					}
				});
		}

		// on load, get surveys
		surveys.activeSurveys = surveys.getSurveys();
	}
}());
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
(function () {
	"use strict";
	angular
        .module("uniSurvey")
        .controller("ResultsDetailsController", ["$stateParams", "resultResource", "surveyResource", ResultsDetailsController]);

	function ResultsDetailsController($stateParams, resultResource, surveyResource) {

		var resultsDetails = this;
		resultsDetails.currentSurveyId = $stateParams.id;
		resultsDetails.legend = true;
		resultsDetails.isLoading = true;

		resultsDetails.survey = {
			id: 1,
			title: "",
			creator: "",
			isActive: 1
		}

		// results model
		resultsDetails.results = {
			questions: []
		}

		resultsDetails.results.questions = resultResource.get.getQuestionResults(
			{ surveyId: resultsDetails.currentSurveyId },
			function (data) {
				resultsDetails.isLoading = false;
			},
			function (response) {
				resultsDetails.messageType = "danger";
				resultsDetails.message = response.statusText + "\r\n";
				if (response.data && response.data.exceptionMessage)
					resultsDetails.message += response.data.exceptionMessage;

				// Validation errors
				if (response.data.modelState) {
					for (var key in response.data.modelState) {
						resultsDetails.message += response.data.modelState[key] + "\r\n";
					}
				}
			}
		);

		// get current survey 
		resultsDetails.getSurvey = function () {
			resultsDetails.survey = surveyResource.get.getSurvey({ id: resultsDetails.currentSurveyId });
		}

		// load current survey
		resultsDetails.getSurvey();
	}
}());
(function () {
	"use strict";
	angular
        .module("uniSurvey")
        .controller("ResultsController", ["surveyResource", ResultsController]);

	function ResultsController(surveyResource) {
		var results = this;

		results.closedSurveys = [];
		results.closedSurveys = surveyResource.getClosedSurveys.getSurveys();
	}
}());
(function () {
	"use strict";
	angular
		.module("uniSurvey")
		.directive("questionDirective", ["$http", "$compile", function ($http, $compile) {

			var getTemplateUrl = function (question) {
				var questionType = question.type;
				var templateUrl = "./src/templates/directives/question/";

				switch (questionType) {
					case "textfield":
						templateUrl += "textfield.html";
						break;
					case "textarea":
						templateUrl += "textarea.html";
						break;
					case "radio":
						templateUrl += "radio.html";
						break;
					case "dropdown":
						templateUrl += "dropdown.html";
						break;
				}

				return templateUrl;
			}

			var linker = function (scope, element) {
				// GET template directive question content from path
				var templateUrl = getTemplateUrl(scope.question);
				$http.get(templateUrl).success(function (data) {
					element.html(data);
					$compile(element.contents())(scope);
				});
			}

			return {
				template: "<div ng-bind=\"question\"></div>",
				restrict: "E",
				scope: {
					question: "="
				},
				link: linker
			}
		}]);
}());
(function () {
	"use strict";
	angular
        .module("uniSurvey")
		// custom angular filter to translate question type key to a more readable question type string
		// usage: '{{$scope.myQuestionTypeKey | questionType}}'
		.filter("questionType", function () {
			return function (questionTypeKey) {
				if (questionTypeKey === "textfield") {
					return "Text Field";
				} else if (questionTypeKey === "textarea") {
					return "Text Area";
				} else if (questionTypeKey === "radio") {
					return "Radio Buttons";
				} else if (questionTypeKey === "dropdown") {
					return "Dropdown List";
				} else {
					return questionTypeKey;
				}
			}
		});
}());


(function () {
	"use strict";
	angular
        .module("uniSurvey")
		// custom angular filter to translate unmeaningful survey status code to text
		// usage: '{{$scope.mySurveyCode | surveyStatusCodeToText}}'
		.filter("surveyStatusCodeToText", function () {
			return function (statusCode) {
				if (statusCode === 0) {
					return "Sent to Students";
				} else if (statusCode === 1) {
					return "Accepting Questions";
				} else if (statusCode === 2) {
					return "Not Receiving Responses";
				} else {
					return statusCode;
				}
			}
	});
}());
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

(function () {
	"use strict";

	angular
        .module("common.services")
        .factory("userAccountResource",
                ["$resource",
                 "appSettings",
				 "currentUser",
                    userAccountResource])

	function userAccountResource($resource, appSettings) {
		return {
			registration: $resource(appSettings.serverPath + "/api/Account/Register", null,
			{
				"registerUser": {
					method: "POST"
				}
			}),
			login: $resource(appSettings.serverPath + "/Token", null,
			{
				"loginUser": {
					method: "POST",
					headers: { "Content-Type": "application/x-www-form-urlencoded" },
					transformRequest: function (data, headersGetter) {
						var str = [];
						for (var d in data)
							str.push(encodeURIComponent(d) + "=" +
								encodeURIComponent(data[d]));
						return str.join("&");
					}
				}
			}),
			logout: $resource(appSettings.serverPath + "/api/Account/Logout", null,
			{
				"logoutUser": {
					method: "POST",
					headers: { 'Authorization': 'Bearer ' + localStorage.getItem("token") }
				}
			})
		}
	}
})();

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
