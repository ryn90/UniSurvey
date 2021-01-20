(function () {
	"use strict";
	angular
        .module("uniSurvey")
		// custom angular filter to translate unmeaningful survey status code to text
		// usage: '{{$scope.mySurveyCode | surveyStatusCodeToText}}'
		.filter("surveyStatusCodeToText", function () {
			return function (statusCode) {
				if (statusCode === 0) {
					return "Sent to Students";
				} else if (statusCode === 1) {
					return "Accepting Questions";
				} else if (statusCode === 2) {
					return "Not Receiving Responses";
				} else {
					return statusCode;
				}
			}
	});
}());