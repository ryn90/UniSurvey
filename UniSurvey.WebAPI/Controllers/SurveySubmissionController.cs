using System;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using UniSurvey.WebAPI.Models;

namespace UniSurvey.WebAPI.Controllers
{
	[EnableCors(origins: "*", headers: "*", methods: "*")]
	public class SurveySubmissionController : ApiController
    {
		/// <summary>
		///		POST: api/SurveySubmission
		/// </summary>
		/// <returns>
		///		Returns an IHttpActionResult containing the inserted Submission
		/// </returns>
		[ResponseType(typeof(Submission))]
		public IHttpActionResult Post([FromBody]Submission surveySubmission)
		{
			try
			{
				var submissionRepository = new SubmissionRepository();
				submissionRepository.ConsumeUserSurvey(surveySubmission);
				submissionRepository.InsertSubmission(surveySubmission);
				return Ok(surveySubmission);
			}
			catch (Exception ex)
			{
				return InternalServerError(ex);
			}
		}
	}
}
