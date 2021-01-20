using System.Data.SqlClient;

namespace UniSurvey.WebAPI.Models
{
	public class SubmissionRepository
	{
		/// <summary>
		///		Consumes a User's eligibility to submit feedback for a survey
		/// </summary>
		/// <returns>Submission, which contains information about the survey id and the username</returns>
		internal Submission ConsumeUserSurvey(Submission submission)
		{
			var connectionString = Utilities.Utilities.GetConnectionStringAzure();
			var dbConnection = new SqlConnection(connectionString);
			var sqlQuery = new SqlCommand { Connection = dbConnection };

			sqlQuery.CommandText = @"UPDATE UserSurvey 
										SET Status = 1
										WHERE 
											Email = @email
										AND 
											SurveyId = @surveyId";

			var emailParam = new SqlParameter
			{
				ParameterName = "@email",
				Value = submission.Username
			};

			var surveyIdParam = new SqlParameter
			{
				ParameterName = "@surveyId",
				Value = submission.SurveyId
			};

			sqlQuery.Parameters.Add(emailParam);
			sqlQuery.Parameters.Add(surveyIdParam);

			dbConnection.Open();
			sqlQuery.ExecuteNonQuery();

			// cleanup 
			dbConnection.Close();
			dbConnection.Dispose();
			sqlQuery.Dispose();

			return submission;
		}

		/// <summary>
		///		Inserts the question submissions without storing the data about the user who submitted it
		/// </summary>
		/// <returns>Submission Object, which contains the values of the questions submitted</returns>
		public Submission InsertSubmission(Submission surveySubmission)
		{
			foreach (var questionSubmission in surveySubmission.Questions)
			{
				if (questionSubmission.Value != "")
				{
					var connectionString = Utilities.Utilities.GetConnectionStringAzure();
					var dbConnection = new SqlConnection(connectionString);
					var sqlQuery = new SqlCommand
					{
						Connection = dbConnection,
						CommandText = @"INSERT INTO Submission (SurveyId, QuestionId, Value)
											VALUES (@surveyId, @questionId, @value)"
					};

					var surveyIdParam = new SqlParameter
					{
						ParameterName = "@surveyId",
						Value = surveySubmission.SurveyId
					};

					var questionIdParam = new SqlParameter
					{
						ParameterName = "@questionId",
						Value = questionSubmission.Id
					};

					var valueParam = new SqlParameter
					{
						ParameterName = "@value",
						Value = questionSubmission.Value
					};

					sqlQuery.Parameters.Add(surveyIdParam);
					sqlQuery.Parameters.Add(questionIdParam);
					sqlQuery.Parameters.Add(valueParam);

					dbConnection.Open();
					sqlQuery.ExecuteNonQuery();

					// cleanup 
					dbConnection.Close();
					dbConnection.Dispose();
					sqlQuery.Dispose();
				}
			}

			return surveySubmission;
		}

	}
}