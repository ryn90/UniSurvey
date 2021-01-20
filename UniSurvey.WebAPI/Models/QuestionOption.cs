namespace UniSurvey.WebAPI.Models
{
	public class QuestionOption
	{
		public int Id { get; set; }
		public int SurveyId { get; set; }
		public int QuestionId { get; set; }
		public int SortOrder { get; set; }
		public string Title { get; set; }
		public string Value { get; set; }
	}
}