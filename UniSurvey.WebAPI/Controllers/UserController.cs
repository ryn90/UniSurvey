using System;
using System.Web.Http;
using System.Web.Http.Description;
using UniSurvey.WebAPI.Models;

namespace UniSurvey.WebAPI.Controllers
{
	public class UserController : ApiController
	{
		/// <summary>
		/// GET: api/User?email={email}
		/// </summary>
		/// <returns>
		///		Returns an IHttpActionResult containg the User GUID or a 404 if the email is not found
		/// </returns>
		[ResponseType(typeof(string))]
		public IHttpActionResult Get(string email)
		{
			try
			{
				var userRepository = new UserRepository();
				var userGuid = userRepository.GetUserGuid(email);

				if (userGuid == null)
				{
					return NotFound();
				}

				return Ok(userGuid);
			}
			catch (Exception ex)
			{
				return InternalServerError(ex);
			}
        }
    }
}
