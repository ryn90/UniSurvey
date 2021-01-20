using System.ComponentModel.DataAnnotations;

namespace UniSurvey.WebAPI.Models
{
	public class User
	{
		[Required(ErrorMessage = "Email Address is required", AllowEmptyStrings = false)]
		[EmailAddress()]
		public string Email { get; set; }
		[Required(ErrorMessage = "Password is required", AllowEmptyStrings = false)]
		public string Password { get; set; }
		[Required(ErrorMessage = "Access Level is required")]
		public int AccessLevel { get; set; }
		[Required(ErrorMessage = "IsActivated is required")]
		public bool IsActivated { get; set; }
	}
}
