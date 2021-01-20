using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace UniSurvey.WebAPI.Models
{
	class QuestionRepository
	{
		/// <summary>
		///		Retrieves a list of Question based on SurveyId
		/// </summary>
		/// <returns>An List of Question</returns>
		internal List<Question> GetQuestions(int surveyId)
		{
			var connectionString = Utilities.Utilities.GetConnectionStringAzure();

			var dbConnection = new SqlConnection(connectionString);
			var sqlQuery = new SqlCommand {Connection = dbConnection};

			var retrievedQuestions = new List<Question>();

			try
			{
				sqlQuery.CommandText = @"SELECT 
											Id, SurveyId, SortOrder, Title, Type, Value, Required 
                                         FROM 
											Question
										 WHERE 
											SurveyId = @surveyId
										 ORDER BY 
											SortOrder ASC";

				var surveyIdParam = new SqlParameter
				{
					ParameterName = "@surveyId",
					Value = surveyId
				};

				sqlQuery.Parameters.Add(surveyIdParam);

				dbConnection.Open();

				var sqlReader = sqlQuery.ExecuteReader();

				if (sqlReader.HasRows)
				{
					DataTable questionTable = new DataTable();
					questionTable.Load(sqlReader);

					var rowCount = 0;

					foreach (DataRow row in questionTable.Rows)
					{
						var currentQuestion = new Question
						{
							Id = Convert.ToInt32(questionTable.Rows[rowCount][0].ToString()),
							SurveyId = Convert.ToInt32(questionTable.Rows[rowCount][1].ToString()),
							SortOrder = Convert.ToInt32(questionTable.Rows[rowCount][2].ToString()),
							Title = questionTable.Rows[rowCount][3].ToString(),
							Type = questionTable.Rows[rowCount][4].ToString(),
							Value = questionTable.Rows[rowCount][5].ToString(),
							IsRequired = Convert.ToBoolean(questionTable.Rows[rowCount][6].ToString()),
							Options = new List<QuestionOption>()
						};

						retrievedQuestions.Add(currentQuestion);

						rowCount++;
					}

					return retrievedQuestions;
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
		///		Inserts or Edits a list of Questions, based on whether it is new or not
		/// </summary>
		/// <returns>An List of Question which were added or edited</returns>
		internal List<Question> InsertQuestions(List<Question> questions)
		{
			foreach (var question in questions)
			{
				if (question.IsNew)
				{
					var connectionString = Utilities.Utilities.GetConnectionStringAzure();
					var dbConnection = new SqlConnection(connectionString);
					var sqlQuery = new SqlCommand
					{
						Connection = dbConnection,
						CommandText = @"INSERT INTO Question (SurveyId, SortOrder, Title, Type, Value, Required)
											VALUES (@surveyId, @sortOrder, @title, @type, @value, @required)"
					};

					var surveyIdParam = new SqlParameter
					{
						ParameterName = "@surveyId",
						Value = question.SurveyId
					};

					var sortOrderParam = new SqlParameter
					{
						ParameterName = "@sortOrder",
						Value = question.SortOrder
					};

					var titleParam = new SqlParameter
					{
						ParameterName = "@title",
						Value = question.Title
					};

					var typeParam = new SqlParameter
					{
						ParameterName = "@type",
						Value = question.Type
					};

					var valueParam = new SqlParameter
					{
						ParameterName = "@value",
						Value = question.Value
					};

					var requiredParam = new SqlParameter
					{
						ParameterName = "@required",
						Value = question.IsRequired ? 1 : 0
					};

					sqlQuery.Parameters.Add(surveyIdParam);
					sqlQuery.Parameters.Add(sortOrderParam);
					sqlQuery.Parameters.Add(titleParam);
					sqlQuery.Parameters.Add(typeParam);
					sqlQuery.Parameters.Add(valueParam);
					sqlQuery.Parameters.Add(requiredParam);

					var sqlQueryIdentity = new SqlCommand
					{
						Connection = dbConnection,
						CommandText = "Select @@Identity"
					};

					dbConnection.Open();
					sqlQuery.ExecuteNonQuery();
					var identity = Convert.ToInt32(sqlQueryIdentity.ExecuteScalar());
					question.Id = identity;
					question.IsNew = false;

					// cleanup 
					dbConnection.Close();
					dbConnection.Dispose();
					sqlQuery.Dispose();
				}
				else
				{
					var connectionString = Utilities.Utilities.GetConnectionStringAzure();
					var dbConnection = new SqlConnection(connectionString);
					var sqlQuery = new SqlCommand
					{
						Connection = dbConnection,
						CommandText = @"UPDATE Question 
											SET 
												SortOrder = @sortOrder, 
												Title = @title, 
												Value = @value, 
												Required = @required
											WHERE 
												Id = @questionId"
					};

					var sortOrderParam = new SqlParameter
					{
						ParameterName = "@sortOrder",
						Value = question.SortOrder
					};

					var titleParam = new SqlParameter
					{
						ParameterName = "@title",
						Value = question.Title
					};

					var valueParam = new SqlParameter
					{
						ParameterName = "@value",
						Value = question.Value
					};

					var requiredParam = new SqlParameter
					{
						ParameterName = "@required",
						Value = question.IsRequired ? 1 : 0
					};

					var questionIdParam = new SqlParameter
					{
						ParameterName = "@questionId",
						Value = question.Id
					};

					sqlQuery.Parameters.Add(sortOrderParam);
					sqlQuery.Parameters.Add(titleParam);
					sqlQuery.Parameters.Add(valueParam);
					sqlQuery.Parameters.Add(requiredParam);
					sqlQuery.Parameters.Add(questionIdParam);

					dbConnection.Open();
					sqlQuery.ExecuteNonQuery();

					// cleanup 
					dbConnection.Close();
					dbConnection.Dispose();
					sqlQuery.Dispose();
				}
			}

			return questions;
		}

		/// <summary>
		///		Removes any question for a given question within a survey
		/// </summary>
		internal void RemoveQuestion(int surveyId, int questionId)
		{
			var connectionString = Utilities.Utilities.GetConnectionStringAzure();

			var dbConnection = new SqlConnection(connectionString);
			var sqlQuery = new SqlCommand { Connection = dbConnection };

			try
			{
				sqlQuery.CommandText = @"DELETE FROM Question
											WHERE Id = @questionId
											AND surveyId = @surveyId"; 
				
				var questionIdParam = new SqlParameter
				{
					ParameterName = "@questionId",
					Value = questionId
				};

				var surveyIdParam = new SqlParameter
				{
					ParameterName = "@surveyId",
					Value = surveyId
				};

				sqlQuery.Parameters.Add(questionIdParam);
				sqlQuery.Parameters.Add(surveyIdParam);

				dbConnection.Open();

				sqlQuery.ExecuteNonQuery();
			}
			finally
			{
				dbConnection.Close();
				dbConnection.Dispose();
				sqlQuery.Dispose();
			}
		}
	}
}
