describe("Create Survey Details - Controller", function () {

	beforeEach(module("uniSurvey"));

	it(" should be defined", inject(function ($controller) {
		var createSurveyDetailsCtrl = $controller("CreateSurveyDetailsController");
		expect(createSurveyDetailsCtrl).toBeDefined();
	}));

	it(" questionTypeHasOptions() Method should return an appropriate boolean result", inject(function ($controller) {
		var createSurveyDetailsCtrl = $controller("CreateSurveyDetailsController");
		expect(createSurveyDetailsCtrl.questionTypeHasOptions("radio")).toBe(true);
		expect(createSurveyDetailsCtrl.questionTypeHasOptions("dropdown")).toBe(true);
		expect(createSurveyDetailsCtrl.questionTypeHasOptions("textfield")).toBe(false);
		expect(createSurveyDetailsCtrl.questionTypeHasOptions("textarea")).toBe(false);
	}));

	it(" isSurveyEditable() Method should return an appropriate boolean result", inject(function ($controller) {
		var createSurveyDetailsCtrl = $controller("CreateSurveyDetailsController");
		expect(createSurveyDetailsCtrl.isSurveyEditable(0)).toBe(false);
		expect(createSurveyDetailsCtrl.isSurveyEditable(1)).toBe(true);
		expect(createSurveyDetailsCtrl.isSurveyEditable(2)).toBe(false);
		expect(createSurveyDetailsCtrl.isSurveyEditable(3)).toBe(false);
	}));

	it(" convertEmailsToEmailList() Method should return emails as a list, split by ','", inject(function ($controller) {
		var createSurveyDetailsCtrl = $controller("CreateSurveyDetailsController");

		var emailsInputTypeA = "email@email.com";
		var emailsInputTypeB = "email@email.com,email2@email.com";
		var emailsInputTypeC = "email@email.com,email2@email.com,email3@email.com";
		var emailsInputTypeD = "email@email.com,email2@email.com,email3@email.com,email4@email.com";

		var emailsOutputListTypeA = ["email@email.com"];
		var emailsOutputListTypeB = ["email@email.com", "email2@email.com"];
		var emailsOutputListTypeC = ["email@email.com", "email2@email.com", "email3@email.com"];
		var emailsOutputListTypeD = ["email@email.com", "email2@email.com", "email3@email.com", "email4@email.com"];

		expect(createSurveyDetailsCtrl.convertEmailsToEmailList(emailsInputTypeA)).toEqual(emailsOutputListTypeA);
		expect(createSurveyDetailsCtrl.convertEmailsToEmailList(emailsInputTypeB)).toEqual(emailsOutputListTypeB);
		expect(createSurveyDetailsCtrl.convertEmailsToEmailList(emailsInputTypeC)).toEqual(emailsOutputListTypeC);
		expect(createSurveyDetailsCtrl.convertEmailsToEmailList(emailsInputTypeD)).toEqual(emailsOutputListTypeD);

	}));

	it(" trimEmails() Method should trim extra characters from emails", inject(function ($controller) {
		var createSurveyDetailsCtrl = $controller("CreateSurveyDetailsController");

		var emailsInputTypeA = ["email@email.com"];
		var emailsInputTypeB = ["email@email.com", " email2@email.com"];
		var emailsInputTypeC = ["     email@email.com   ", "email2@email.com"];
		var emailsInputTypeD = ["    email@email.com", "  email2@email.com   ", "  email3@email.com  ", "    email4@email.com  "];

		var emailsOutputTypeA = ["email@email.com"];
		var emailsOutputTypeB = ["email@email.com", "email2@email.com"];
		var emailsOutputTypeC = ["email@email.com", "email2@email.com"];
		var emailsOutputTypeD = ["email@email.com", "email2@email.com", "email3@email.com", "email4@email.com"];

		expect(createSurveyDetailsCtrl.trimEmails(emailsInputTypeA)).toEqual(emailsOutputTypeA);
		expect(createSurveyDetailsCtrl.trimEmails(emailsInputTypeB)).toEqual(emailsOutputTypeB);
		expect(createSurveyDetailsCtrl.trimEmails(emailsInputTypeC)).toEqual(emailsOutputTypeC);
		expect(createSurveyDetailsCtrl.trimEmails(emailsInputTypeD)).toEqual(emailsOutputTypeD);

	}));

	it(" validateEmail() Method should validate emails", inject(function ($controller) {
		var createSurveyDetailsCtrl = $controller("CreateSurveyDetailsController");

		var emailInputTypeA = "email@domain.com";
		var emailInputTypeB = "myemail";
		var emailInputTypeC = "myemail@";
		var emailInputTypeD = "myemail@.com";
		var emailInputTypeE = "partA.partB@domain.com";

		expect(createSurveyDetailsCtrl.validateEmail(emailInputTypeA)).toBe(true);
		expect(createSurveyDetailsCtrl.validateEmail(emailInputTypeB)).toBe(false);
		expect(createSurveyDetailsCtrl.validateEmail(emailInputTypeC)).toBe(false);
		expect(createSurveyDetailsCtrl.validateEmail(emailInputTypeD)).toBe(false);
		expect(createSurveyDetailsCtrl.validateEmail(emailInputTypeE)).toBe(true);
	}));
});