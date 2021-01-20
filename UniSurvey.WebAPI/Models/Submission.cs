using System.Collections.Generic;

namespace UniSurvey.WebAPI.Models
{
	public class Submission
	{
		public int SurveyId { get; set; }
		public string Username { get; set; }
		public List<Question> Questions { get; set; }
	}
}