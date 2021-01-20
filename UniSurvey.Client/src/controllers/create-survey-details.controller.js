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