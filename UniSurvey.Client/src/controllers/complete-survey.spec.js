describe("Complete Survey - Controller", function () {

	beforeEach(module("uniSurvey"));

	it(" should be defined", inject(function ($controller) {
		var completeSurveyCtrl = $controller("CompleteSurveyController");
		expect(completeSurveyCtrl).toBeDefined();
	}));
});