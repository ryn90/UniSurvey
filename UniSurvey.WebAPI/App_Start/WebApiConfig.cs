using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json.Serialization;

namespace UniSurvey.WebAPI
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services
            // Configure Web API to use only bearer token authentication.
            config.SuppressDefaultHostAuthentication();
            config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));

            // Web API routes
            config.MapHttpAttributeRoutes();

			// Used to transform Pascal Casing from the models to Camel Casing which is used by AngularJS
			// in order to maintain both language's coding conventions
	        config.Formatters.JsonFormatter.SerializerSettings.ContractResolver =
		        new CamelCasePropertyNamesContractResolver(); 

			// Enable Cross Origin Request Sharing (CORS) so that we would be able to access the Web API from a 
			// different URL from the Web API URL
	        config.EnableCors();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

			var json = config.Formatters.JsonFormatter;
			json.SerializerSettings.Formatting = Newtonsoft.Json.Formatting.Indented;
		}
    }
}
