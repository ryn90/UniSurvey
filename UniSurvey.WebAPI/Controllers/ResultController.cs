using System;
using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using UniSurvey.WebAPI.Models;

namespace UniSurvey.WebAPI.Controllers
{
	[EnableCors(origins: "*", headers: "*", methods: "*")]
	public class ResultController : ApiController
    {
		/// <summary>
		/// GET: api/Result/5
		/// </summary>
		/// <returns>
		///		Returns an IHttpActionResult containg the survey details added, 
		///		in this case, emails of students who will be sent this survey
		/// </returns>
		[ResponseType(typeof(List<QuestionResult>))]
		public IHttpActionResult Get(int surveyId)
        {
			try
			{
				// load questions
				var questionResultRepository = new QuestionResultRepository();
				var surveyQuestions = questionResultRepository.GetQuestions(surveyId);

				// load question options
				var surveyQuestionsWithOptions = questionResultRepository.GetQuestionOptions(surveyQuestions);

				// load results for each question and option (if relevant)
				var surveyQuestionsResults = questionResultRepository.GetQuestionResults(surveyQuestionsWithOptions);

				if (surveyQuestionsWithOptions == null)
				{
					return NotFound();
				}

				return Ok(surveyQuestionsResults);
			}
			catch (Exception ex)
			{
				return InternalServerError(ex);
			}
		}
    }
}
