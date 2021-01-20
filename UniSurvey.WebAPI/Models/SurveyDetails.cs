using System.Collections.Generic;

namespace UniSurvey.WebAPI.Models
{
	public class SurveyDetails
	{
		public int SurveyId { get; set; }
		public List<string> Respondents { get; set; }
	}
}