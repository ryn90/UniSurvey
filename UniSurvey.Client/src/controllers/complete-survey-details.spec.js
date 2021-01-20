describe("Complete Survey Details - Controller", function () {

	beforeEach(module("uniSurvey"));

	it(" should be defined", inject(function ($controller) {
		var completeSurveyDetailsCtrl = $controller("CompleteSurveyDetailsController");
		expect(completeSurveyDetailsCtrl).toBeDefined();
	}));
});