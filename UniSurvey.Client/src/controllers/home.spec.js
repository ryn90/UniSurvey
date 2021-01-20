describe("Home - Controller", function () {

	beforeEach(module("uniSurvey"));

	it(" should be defined", inject(function ($controller) {
		var homeCtrl = $controller("HomeController");
		expect(homeCtrl).toBeDefined();
	}));
});