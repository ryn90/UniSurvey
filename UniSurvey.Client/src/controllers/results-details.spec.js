describe("Results Details - Controller", function () {

	beforeEach(module("uniSurvey"));

	it(" should be defined", inject(function ($controller) {
		var resultsDetailsCtrl = $controller("ResultsDetailsController");
		expect(resultsDetailsCtrl).toBeDefined();
	}));
});