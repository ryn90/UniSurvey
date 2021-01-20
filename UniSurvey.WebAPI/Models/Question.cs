using System.Collections.Generic;

namespace UniSurvey.WebAPI.Models
{
	public class Question
	{
		public int Id { get; set; }
		public int SurveyId { get; set; }
		public int SortOrder { get; set; }
		public string Title { get; set; }
		public string Type { get; set; }
		public string Value { get; set; }
		public bool IsRequired { get; set; }
		public List<QuestionOption> Options { get; set; }
		public bool IsNew { get; set; }
	}
}