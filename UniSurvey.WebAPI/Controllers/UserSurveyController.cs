using System;
using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using UniSurvey.WebAPI.Models;

namespace UniSurvey.WebAPI.Controllers
{
	[EnableCors(origins: "*", headers: "*", methods: "*")]
	public class UserSurveyController : ApiController
    {
		/// <summary>
		/// GET: api/UserSurvey
		/// </summary>
		/// <returns>
		///		Returns an IHttpActionResult containg a list of Surveys 
		///		which the user provided has access to, otherwise, it will return 
		///		a 404 if nothing was found 
		/// </returns>
		[ResponseType(typeof(List<Survey>))]
		public IHttpActionResult Get(string email)
        {
			try
			{
				var surveyrepository = new SurveyRepository();
				var userSurveys = surveyrepository.GetSurveysForUser(email);

				if (userSurveys == null)
				{
					return NotFound();
				}

				return Ok(userSurveys);
			}
			catch (Exception ex)
			{
				return InternalServerError(ex);
			}
		}
	}
}
