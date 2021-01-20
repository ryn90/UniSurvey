describe("Create Survey - Controller", function () {

	beforeEach(module("uniSurvey"));

	it(" should be defined", inject(function ($controller) {
		var createSurveyCtrl = $controller("CreateSurveyController");
		expect(createSurveyCtrl).toBeDefined();
	}));
});