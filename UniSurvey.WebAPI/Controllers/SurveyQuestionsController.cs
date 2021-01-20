using System;
using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using UniSurvey.WebAPI.Models;

namespace UniSurvey.WebAPI.Controllers
{
	[EnableCors(origins: "*", headers: "*", methods: "*")]
	public class SurveyQuestionsController : ApiController
	{
		/// <summary>
		///		GET: api/SurveyQuestions/5
		/// </summary>
		/// <returns>
		///		Returns an IHttpActionResult containg a List of Questions objects by SurveyId 
		///		or a 404 otherwise
		/// </returns>
		[ResponseType(typeof(List<Question>))]
		public IHttpActionResult Get(int id)
		{
			try
			{
				// get questions
				var questionRepository = new QuestionRepository();
				var surveyQuestions = questionRepository.GetQuestions(id);

				// get options
				var questionOptionsRepository = new QuestionOptionRepository();
				var surveyQuestionsWithOptions = questionOptionsRepository.GetQuestionOptions(surveyQuestions);

				if (surveyQuestionsWithOptions == null)
				{
					return NotFound();
				}

				return Ok(surveyQuestionsWithOptions);
			}
			catch (Exception ex)
			{
				return InternalServerError(ex);
			}
		}

		/// <summary>
		/// PUT: api/SurveyQuestions?surveyId={surveyId}&questionId{qustionId}
		/// </summary>
		/// <returns>
		///		Removes a question and its options (if it has) and returns
		///		the question ID. 
		/// </returns>
		[ResponseType(typeof(int))]
		public IHttpActionResult Put(int surveyId, int questionId)
		{
			try
			{
				// remove questions
				var questionRepository = new QuestionRepository();
				questionRepository.RemoveQuestion(surveyId, questionId);

				// remove options
				var questionOptionsRepository = new QuestionOptionRepository();
				questionOptionsRepository.RemoveOptions(surveyId, questionId);

				return Ok(questionId);
			}
			catch (Exception ex)
			{
				return InternalServerError(ex);
			}
		}

		/// <summary>
		///		POST: api/SurveyQuestions
		/// </summary>
		/// <returns>
		///		Returns an IHttpActionResult containg the survey questions, 
		///		in this case, a list of emails of students who will be sent this survey
		/// </returns>
		[ResponseType(typeof(List<Question>))]
		public IHttpActionResult Post([FromBody]List<Question> questions)
		{
			try
			{
				var questionRepository = new QuestionRepository();
				var questionOptionsRepository = new QuestionOptionRepository();

				// insert questions
				var surveyQuestions = questionRepository.InsertQuestions(questions);
				
				// insert options
				var surveyQuestionOptions = questionOptionsRepository.InsertOptions(surveyQuestions);

				return Created<List<Question>>(Request.RequestUri, surveyQuestionOptions);
			}
			catch (Exception ex)
			{
				return InternalServerError(ex);
			}
		}
	}
}
