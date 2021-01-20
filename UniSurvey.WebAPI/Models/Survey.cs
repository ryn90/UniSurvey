namespace UniSurvey.WebAPI.Models
{
	public class Survey
	{
		public int Id { get; set; }
		public string Title { get; set; }
		public string Creator { get; set; }
		public int IsActive { get; set; }
	}
}
