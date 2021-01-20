using System;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using UniSurvey.WebAPI.Models;

namespace UniSurvey.WebAPI.Controllers
{
	[EnableCors(origins: "*", headers: "*", methods: "*")]
	public class UserRoleController : ApiController
	{
		/// <summary>
		/// GET: api/UserRole?email={email}
		/// </summary>
		/// <returns>
		///		Returns an IHttpActionResult containg the User object if the email address 
		///		is found or a 404 if the email is not found
		/// </returns>
		[ResponseType(typeof(User))]
		public IHttpActionResult Get(string email)
		{
			try
			{
				var userRepository = new UserRepository();
				var user = userRepository.GetAccessLevel(email);
				if (user == null)
				{
					return NotFound();
				}

				return Ok(user);
			}
			catch (Exception ex)
			{
				return InternalServerError(ex);
			}
		}

		/// <summary>
		/// PUT: api/SurveyQuestions
		/// </summary>
		/// <returns>
		///		Removes a question and its options (if it has) and returns
		///		the question ID. 
		/// </returns>
		[ResponseType(typeof(UserConfirmation))]
		public IHttpActionResult Put([FromBody]UserConfirmation userConfirmation)
		{
			try
			{
				// check if confirmation code matches
				var userRepository = new UserRepository();
				var userGuid = userRepository.GetUserGuid(userConfirmation.ConfirmationEmail);

				// if userGuid matches
				if (userGuid == userConfirmation.ConfirmationCode)
				{
					userRepository.ActivateUser(userConfirmation.ConfirmationEmail);
				}
				else
				{
					return NotFound();
				}

				return Ok(userConfirmation);
			}
			catch (Exception ex)
			{
				return InternalServerError(ex);
			}
		}
	}
}
