describe("Survey Status Code to Text - Filter", function () {
	beforeEach(function () {
		module("uniSurvey");
	});
	it(" has a survey status code to text filter", inject(function (surveyStatusCodeToTextFilter) {
		expect(surveyStatusCodeToTextFilter('surveyStatusCodeToText')).not.toBeNull();
	}));
	it(" should return the appropriate string equivalents for the survey status codes", inject(function (surveyStatusCodeToTextFilter) {
		expect(surveyStatusCodeToTextFilter(0)).toEqual("Sent to Students");
		expect(surveyStatusCodeToTextFilter(1)).toEqual("Accepting Questions");
		expect(surveyStatusCodeToTextFilter(2)).toEqual("Not Receiving Responses");
		expect(surveyStatusCodeToTextFilter(3)).toEqual(3);
	}));
});