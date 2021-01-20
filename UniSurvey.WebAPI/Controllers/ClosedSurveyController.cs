using System;
using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using UniSurvey.WebAPI.Models;

namespace UniSurvey.WebAPI.Controllers
{
	[EnableCors(origins: "*", headers: "*", methods: "*")]
	public class ClosedSurveyController : ApiController
	{
		/// <summary>
		/// GET: api/ClosedSurvey
		/// </summary>
		/// <returns>
		///		Returns an IHttpActionResult containg a List of closed Survey objects if 
		///		available or a 404 otherwise
		/// </returns>
		[ResponseType(typeof(List<Survey>))]
		public IHttpActionResult Get()
		{
			try
			{
				var surveyrepository = new SurveyRepository();
				var surveys = surveyrepository.GetClosedSurveys();
				if (surveys == null)
				{
					return NotFound();
				}

				return Ok(surveys);
			}
			catch (Exception ex)
			{
				return InternalServerError(ex);
			}
		}
	}
}
