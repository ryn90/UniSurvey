(function () {
	"use strict";

	angular
        .module("common.services",
                    ["ngResource"])
    	.constant("appSettings",
        {
			// todo: replace with Azure WebAPI Path for Production Use
        	serverPath: "http://localhost:51608"
        	// serverPath: "http://unisurveywebapi.azurewebsites.net"
        });
}());
