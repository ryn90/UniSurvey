describe("Results - Controller", function () {

	beforeEach(module("uniSurvey"));

	it(" should be defined", inject(function ($controller) {
		var resultsCtrl = $controller("ResultsController");
		expect(resultsCtrl).toBeDefined();
	}));
});