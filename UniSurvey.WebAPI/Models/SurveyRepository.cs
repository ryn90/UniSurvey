using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace UniSurvey.WebAPI.Models
{
	internal class SurveyRepository
	{
		/// <summary>
		/// Retrieves a list of Surveys
		/// </summary>
		/// <returns>List of Survey Object</returns>
		internal List<Survey> GetSurveys()
		{
			var connectionString = Utilities.Utilities.GetConnectionStringAzure();

			var dbConnection = new SqlConnection(connectionString);
			var sqlQuery = new SqlCommand {Connection = dbConnection};

			var retrievedSurveys = new List<Survey>();

			try
			{
				sqlQuery.CommandText = @"SELECT 
											Id, Title, Creator, IsActive 
                                         FROM 
											Survey";

				dbConnection.Open();

				var sqlReader = sqlQuery.ExecuteReader();

				if (sqlReader.HasRows)
				{
					DataTable userTable = new DataTable();
					userTable.Load(sqlReader);

					var rowCount = 0;

					foreach (DataRow row in userTable.Rows)
					{
						var currentSurvey = new Survey
						{
							Id = Convert.ToInt32(userTable.Rows[rowCount][0].ToString()),
							Title = userTable.Rows[rowCount][1].ToString(),
							Creator = userTable.Rows[rowCount][2].ToString(),
							IsActive = Convert.ToInt32(userTable.Rows[rowCount][3].ToString())
						};

						retrievedSurveys.Add(currentSurvey);

						rowCount++;
					}

					return retrievedSurveys;
				}
			}
			finally
			{
				dbConnection.Close();
				dbConnection.Dispose();
				sqlQuery.Dispose();
			}

			return null;
		}

		/// <summary>
		/// Retrieves a list of Surveys which may have feedback,
		/// that being status 0 (Sent to Students) or 2 (Not Receiving Responses)
		/// </summary>
		/// <returns>List of Survey Object</returns>
		internal List<Survey> GetClosedSurveys()
		{
			var connectionString = Utilities.Utilities.GetConnectionStringAzure();

			var dbConnection = new SqlConnection(connectionString);
			var sqlQuery = new SqlCommand {Connection = dbConnection};

			var retrievedSurveys = new List<Survey>();

			try
			{
				sqlQuery.CommandText = @"SELECT 
											Id, Title, Creator, IsActive 
                                         FROM 
											Survey
										WHERE 
											IsActive = 0
										OR
											IsActive = 2";

				dbConnection.Open();

				var sqlReader = sqlQuery.ExecuteReader();

				if (sqlReader.HasRows)
				{
					DataTable userTable = new DataTable();
					userTable.Load(sqlReader);

					var rowCount = 0;

					foreach (DataRow row in userTable.Rows)
					{
						var currentSurvey = new Survey
						{
							Id = Convert.ToInt32(userTable.Rows[rowCount][0].ToString()),
							Title = userTable.Rows[rowCount][1].ToString(),
							Creator = userTable.Rows[rowCount][2].ToString(),
							IsActive = Convert.ToInt32(userTable.Rows[rowCount][3].ToString())
						};

						retrievedSurveys.Add(currentSurvey);

						rowCount++;
					}

					return retrievedSurveys;
				}
			}
			finally
			{
				dbConnection.Close();
				dbConnection.Dispose();
				sqlQuery.Dispose();
			}

			return null;
		}

		/// <summary>
		/// Retrieves an individual survey, by survey id
		/// </summary>
		/// <returns>A Survey Object</returns>
		internal Survey GetSurvey(int id)
		{
			var connectionString = Utilities.Utilities.GetConnectionStringAzure();

			var dbConnection = new SqlConnection(connectionString);
			var sqlQuery = new SqlCommand();
			sqlQuery.Connection = dbConnection;

			try
			{
				sqlQuery.CommandText = @"SELECT 
											Id, Title, Creator, IsActive 
                                         FROM 
											Survey
										 WHERE 
											Id = @id";

				var idParam = new SqlParameter
				{
					ParameterName = "@id",
					Value = id
				};

				sqlQuery.Parameters.Add(idParam);

				dbConnection.Open();

				var sqlReader = sqlQuery.ExecuteReader();

				if (sqlReader.HasRows)
				{
					var userTable = new DataTable();
					userTable.Load(sqlReader);

					var retrievedSurvey = new Survey
					{
						Id = Convert.ToInt32(userTable.Rows[0][0].ToString()),
						Title = userTable.Rows[0][1].ToString(),
						Creator = userTable.Rows[0][2].ToString(),
						IsActive = Convert.ToInt32(userTable.Rows[0][3].ToString())
					};

					return retrievedSurvey;
				}
			}
			finally
			{
				dbConnection.Close();
				dbConnection.Dispose();
				sqlQuery.Dispose();
			}

			return null;
		}

		/// <summary>
		/// Insert a Survey to the database, from the Survey object given
		/// </summary>
		/// <returns>A Survey Object which was created</returns>
		internal Survey InsertSurvey(Survey survey)
		{
			var connectionString = Utilities.Utilities.GetConnectionStringAzure();

			var dbConnection = new SqlConnection(connectionString);
			var sqlQuery = new SqlCommand {Connection = dbConnection};

			try
			{
				sqlQuery.CommandText = @"INSERT INTO Survey (Title, Creator, IsActive)
											VALUES (@surveyTitle, @creator, 1)";

				var titleParam = new SqlParameter
				{
					ParameterName = "@surveyTitle",
					Value = survey.Title
				};

				var creatorParam = new SqlParameter
				{
					ParameterName = "@creator",
					Value = survey.Creator
				};

				sqlQuery.Parameters.Add(titleParam);
				sqlQuery.Parameters.Add(creatorParam);

				dbConnection.Open();

				sqlQuery.ExecuteNonQuery();
			}
			finally
			{
				dbConnection.Close();
				dbConnection.Dispose();
				sqlQuery.Dispose();
			}

			return survey;
		}

		/// <summary>
		///		Updates Survey's Status. This is used when the survey is sent to
		///		students or is stopped from receiving further responses
		/// </summary>
		/// <returns>A Survey ID which was Updated</returns>
		internal int UpdateSurveyStatus(int surveyId, int surveyStatusCode)
		{
			var connectionString = Utilities.Utilities.GetConnectionStringAzure();

			var dbConnection = new SqlConnection(connectionString);
			var sqlQuery = new SqlCommand { Connection = dbConnection };

			try
			{
				sqlQuery.CommandText = @"UPDATE Survey 
											SET IsActive = @surveyStatusCode
											WHERE Id = @surveyId";

				var surveyIdParam = new SqlParameter
				{
					ParameterName = "@surveyid",
					Value = surveyId
				};

				var surveyStatusCodeParam = new SqlParameter
				{
					ParameterName = "@surveyStatusCode",
					Value = surveyStatusCode
				};

				sqlQuery.Parameters.Add(surveyIdParam);
				sqlQuery.Parameters.Add(surveyStatusCodeParam);

				dbConnection.Open();

				sqlQuery.ExecuteNonQuery();
			}
			finally
			{
				dbConnection.Close();
				dbConnection.Dispose();
				sqlQuery.Dispose();
			}

			return surveyStatusCode;
		}

		/// <summary>
		///		Retrieves surveys a user has access to
		/// </summary>
		/// <returns>A list of surveys</returns>
		internal List<Survey> GetSurveysForUser(string email)
		{
			var connectionString = Utilities.Utilities.GetConnectionStringAzure();

			var dbConnection = new SqlConnection(connectionString);
			var sqlQuery = new SqlCommand { Connection = dbConnection };

			var retrievedSurveys = new List<Survey>();

			try
			{
				sqlQuery.CommandText = @"SELECT 
												Survey.Id, Survey.Title, Survey.Creator, Survey.IsActive 
											FROM 
												Survey
											JOIN 
												UserSurvey 
											ON
												Survey.Id = UserSurvey.SurveyId
											WHERE 
												Survey.IsActive = 0
											AND
												UserSurvey.Email = @email
											AND 
												UserSurvey.Status = 0";

				var emailParam = new SqlParameter
				{
					ParameterName = "@email",
					Value = email
				};

				sqlQuery.Parameters.Add(emailParam);

				dbConnection.Open();

				var sqlReader = sqlQuery.ExecuteReader();

				if (sqlReader.HasRows)
				{
					DataTable userTable = new DataTable();
					userTable.Load(sqlReader);

					var rowCount = 0;

					foreach (DataRow row in userTable.Rows)
					{
						var currentSurvey = new Survey
						{
							Id = Convert.ToInt32(userTable.Rows[rowCount][0].ToString()),
							Title = userTable.Rows[rowCount][1].ToString(),
							Creator = userTable.Rows[rowCount][2].ToString(),
							IsActive = Convert.ToInt32(userTable.Rows[rowCount][3].ToString())
						};

						retrievedSurveys.Add(currentSurvey);

						rowCount++;
					}

					return retrievedSurveys;
				}
			}
			finally
			{
				dbConnection.Close();
				dbConnection.Dispose();
				sqlQuery.Dispose();
			}

			return null;
		} 
	}
}
