(function () {
	"use strict";
	angular
        .module("uniSurvey")
		// custom angular filter to translate question type key to a more readable question type string
		// usage: '{{$scope.myQuestionTypeKey | questionType}}'
		.filter("questionType", function () {
			return function (questionTypeKey) {
				if (questionTypeKey === "textfield") {
					return "Text Field";
				} else if (questionTypeKey === "textarea") {
					return "Text Area";
				} else if (questionTypeKey === "radio") {
					return "Radio Buttons";
				} else if (questionTypeKey === "dropdown") {
					return "Dropdown List";
				} else {
					return questionTypeKey;
				}
			}
		});
}());

