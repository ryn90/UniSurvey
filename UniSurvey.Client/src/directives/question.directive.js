(function () {
	"use strict";
	angular
		.module("uniSurvey")
		.directive("questionDirective", ["$http", "$compile", function ($http, $compile) {

			var getTemplateUrl = function (question) {
				var questionType = question.type;
				var templateUrl = "./src/templates/directives/question/";

				switch (questionType) {
					case "textfield":
						templateUrl += "textfield.html";
						break;
					case "textarea":
						templateUrl += "textarea.html";
						break;
					case "radio":
						templateUrl += "radio.html";
						break;
					case "dropdown":
						templateUrl += "dropdown.html";
						break;
				}

				return templateUrl;
			}

			var linker = function (scope, element) {
				// GET template directive question content from path
				var templateUrl = getTemplateUrl(scope.question);
				$http.get(templateUrl).success(function (data) {
					element.html(data);
					$compile(element.contents())(scope);
				});
			}

			return {
				template: "<div ng-bind=\"question\"></div>",
				restrict: "E",
				scope: {
					question: "="
				},
				link: linker
			}
		}]);
}());