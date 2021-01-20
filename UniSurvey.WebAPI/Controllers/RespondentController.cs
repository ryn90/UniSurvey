using System;
using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using UniSurvey.WebAPI.Models;

namespace UniSurvey.WebAPI.Controllers
{
	[EnableCors(origins: "*", headers: "*", methods: "*")]
	public class RespondentController : ApiController
    {
		/// <summary>
		/// POST: api/Respondent
		/// </summary>
		/// <returns>
		///		Returns an IHttpActionResult containg the survey details added, 
		///		in this case, emails of students who will be sent this survey
		/// </returns>
		[ResponseType(typeof(List<SurveyDetails>))]
		public IHttpActionResult Post([FromBody]SurveyDetails studentEmails)
        {
	        try
	        {
				// save to DB
				var surveyDetailsRepository = new SurveyDetailsRepository();
				surveyDetailsRepository.SendToStudents(studentEmails);

				// send emails to respondents
		        Utilities.Utilities.SendRespondentsEmail(studentEmails.Respondents);

				// update survey status
				var surveyRepository = new SurveyRepository();
		        surveyRepository.UpdateSurveyStatus(studentEmails.SurveyId, 0);

				return Created<SurveyDetails>(Request.RequestUri, studentEmails);
			}
			catch (Exception ex)
			{
				return InternalServerError(ex);
			}
		}
    }
}
