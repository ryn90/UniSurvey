using System.Collections.Generic;

namespace UniSurvey.WebAPI.Models
{
	public class QuestionResult
	{
		public int SurveyId { get; set; }
		public int QuestionId { get; set; }
		public int SortOrder { get; set; }
		public string Title { get; set; }
		public string QuestionType { get; set; }
		public bool IsRequired { get; set; }
		public List<string> Values { get; set; }
		public List<string> OptionTitles { get; set; }
		public List<string> OptionValues { get; set; }
		public List<int> OptionSelectionCounts { get; set; }
	}
}
