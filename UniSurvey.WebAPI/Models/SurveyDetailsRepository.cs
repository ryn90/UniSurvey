using System.Data.SqlClient;

namespace UniSurvey.WebAPI.Models
{
	public class SurveyDetailsRepository
	{
		/// <summary>
		///		If the user does not already have access, grant access to that user for a given survey
		/// </summary>
		/// <returns>Survey Details, which contains a Survey ID and a list of eligible users</returns>
		internal SurveyDetails SendToStudents(SurveyDetails details)
		{
			foreach (var respondent in details.Respondents)
			{
				// UserSurvey Status
				// 0 = Awaiting Feedback
				// 1 = Feedback Given

				// check if it exists already
				var hasAccess = HasAccess(details.SurveyId, respondent);

				// skip this respondent if access was already granted
				if (hasAccess)
				{
					continue;
				}

				var connectionString = Utilities.Utilities.GetConnectionStringAzure();
				var dbConnection = new SqlConnection(connectionString);
				var sqlQuery = new SqlCommand { Connection = dbConnection };

				sqlQuery.CommandText = @"INSERT INTO UserSurvey (Email, SurveyId, Status)
											VALUES (@email, @surveyId, 0)";

				var emailParam = new SqlParameter
				{
					ParameterName = "@email",
					Value = respondent
				};

				var surveyIdParam = new SqlParameter
				{
					ParameterName = "@surveyId",
					Value = details.SurveyId
				};

				sqlQuery.Parameters.Add(emailParam);
				sqlQuery.Parameters.Add(surveyIdParam);

				dbConnection.Open();
				sqlQuery.ExecuteNonQuery();

				// cleanup 
				dbConnection.Close();
				dbConnection.Dispose();
				sqlQuery.Dispose();
			}

			return details;
		}

		/// <summary>
		///		Checks if a user already has access, so no duplicate access is granted
		/// </summary>
		/// <returns>A boolean, representing whether a user hasAccess</returns>
		internal bool HasAccess(int surveyId, string respondentEmail)
		{
			var connectionString = Utilities.Utilities.GetConnectionStringAzure();

			var dbConnection = new SqlConnection(connectionString);
			var sqlQuery = new SqlCommand { Connection = dbConnection };

			try
			{
				sqlQuery.CommandText = @"SELECT 
											* 
                                         FROM 
											UserSurvey
										WHERE 
											Email = @Email
										AND 
											SurveyId = @SurveyId";

				var emailParam = new SqlParameter
				{
					ParameterName = "@email",
					Value = respondentEmail
				};

				var surveyIdParam = new SqlParameter
				{
					ParameterName = "@surveyId",
					Value = surveyId
				};

				sqlQuery.Parameters.Add(emailParam);
				sqlQuery.Parameters.Add(surveyIdParam);

				dbConnection.Open();

				var sqlReader = sqlQuery.ExecuteReader();

				if (sqlReader.HasRows)
				{
					return true;
				}
			}
			finally
			{
				dbConnection.Close();
				dbConnection.Dispose();
				sqlQuery.Dispose();
			}

			return false;
		}
	}
}