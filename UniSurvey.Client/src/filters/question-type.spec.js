describe("Question Type Key to Description - Filter", function () {
	beforeEach(function () {
		module("uniSurvey");
	});
	it(" has a question type filter", inject(function (questionTypeFilter) {
		expect(questionTypeFilter("questionType")).not.toBeNull();
	}));
	it(" should return the appropriate question type description", inject(function (questionTypeFilter) {
		expect(questionTypeFilter("textfield")).toEqual("Text Field");
		expect(questionTypeFilter("textarea")).toEqual("Text Area");
		expect(questionTypeFilter("radio")).toEqual("Radio Buttons");
		expect(questionTypeFilter("dropdown")).toEqual("Dropdown List");
		expect(questionTypeFilter("nonExistingKey")).toEqual("nonExistingKey");
	}));
});