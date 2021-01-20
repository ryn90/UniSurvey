using System;
using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using UniSurvey.WebAPI.Models;

namespace UniSurvey.WebAPI.Controllers
{
	[EnableCors(origins: "*", headers: "*", methods: "*")]
	public class SurveyController : ApiController
	{
		/// <summary>
		/// GET: api/Survey
		/// </summary>
		/// <returns>
		///		Returns an IHttpActionResult containg a List of Survey objects if there are 
		///		surveys or a 404 otherwise
		/// </returns>
		[ResponseType(typeof(List<Survey>))]
		public IHttpActionResult Get()
		{
			try
			{
				var surveyrepository = new SurveyRepository();
				var surveys = surveyrepository.GetSurveys();

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

		/// <summary>
		/// GET: api/Survey/5
		/// </summary>
		/// <returns>
		///		Returns an IHttpActionResult containg a Survey object if the requested Survey 
		///		exists for the id passed or a 404 otherwise
		/// </returns>
		[ResponseType(typeof(Survey))]
		public IHttpActionResult Get(int id)
		{
			try
			{
				var surveyRepository = new SurveyRepository();
				var survey = surveyRepository.GetSurvey(id);
				if (survey == null)
				{
					return NotFound();
				}

				return Ok(survey);
			}
			catch (Exception ex)
			{
				return InternalServerError(ex);
			}

		}

		/// <summary>
		/// PUT: api/Survey
		/// </summary>
		/// <returns>
		///		Updates the survey status and returns a survey if successful
		/// </returns>
		[ResponseType(typeof(Survey))]
		public IHttpActionResult Put([FromBody]Survey survey)
		{
			try
			{
				var surveyRepository = new SurveyRepository();
				surveyRepository.UpdateSurveyStatus(survey.Id, survey.IsActive);
				return Created<Survey>(Request.RequestUri, survey);
			}
			catch (Exception ex)
			{
				return InternalServerError(ex);
			}
		}

		/// <summary>
		/// POST: api/Survey
		/// </summary>
		/// <returns>
		///		Returns an IHttpActionResult containg the created Survey object if the survey
		///		object passed has been added successfully or an exception otherwise
		/// </returns>
		[ResponseType(typeof(Survey))]
		public IHttpActionResult Post([FromBody]Survey survey)
		{
			try
			{
				var surveyRepository = new SurveyRepository();
				surveyRepository.InsertSurvey(survey);
				return Created<Survey>(Request.RequestUri, survey);
			}
			catch (Exception ex)
			{
				return InternalServerError(ex);
			}
		}
	}
}
