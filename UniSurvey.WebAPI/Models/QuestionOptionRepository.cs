using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace UniSurvey.WebAPI.Models
{
	public class QuestionOptionRepository
	{
		/// <summary>
		/// Retrieves a list of Question Options based on SurveyId and QuestionId
		/// </summary>
		/// <returns>An List of Question Options</returns>
		internal List<Question> GetQuestionOptions(List<Question> questions)
		{
			if (questions == null)
			{
				return null;
			}

			foreach (var question in questions)
			{
				var connectionString = Utilities.Utilities.GetConnectionStringAzure();

				var dbConnection = new SqlConnection(connectionString);
				var sqlQuery = new SqlCommand { Connection = dbConnection };

				try
				{
					sqlQuery.CommandText = @"SELECT 
												Id, SurveyId, QuestionId, SortOrder, Title, Value
											 FROM 
												[Option]
											 WHERE 
												SurveyId = @surveyId
											 AND 
												QuestionId = @questionId";

					var surveyIdParam = new SqlParameter
					{
						ParameterName = "@surveyId",
						Value = question.SurveyId
					};

					var questionIdParam = new SqlParameter
					{
						ParameterName = "@questionId",
						Value = question.Id
					};

					sqlQuery.Parameters.Add(surveyIdParam);
					sqlQuery.Parameters.Add(questionIdParam);

					dbConnection.Open();

					var sqlReader = sqlQuery.ExecuteReader();

					if (sqlReader.HasRows)
					{
						DataTable optionTable = new DataTable();
						optionTable.Load(sqlReader);

						var rowCount = 0;

						foreach (DataRow row in optionTable.Rows)
						{
							var currentQuestionOption = new QuestionOption
							{
								Id = Convert.ToInt32(optionTable.Rows[rowCount][0].ToString()),
								SurveyId = Convert.ToInt32(optionTable.Rows[rowCount][1].ToString()),
								QuestionId = Convert.ToInt32(optionTable.Rows[rowCount][2].ToString()),
								SortOrder = Convert.ToInt32(optionTable.Rows[rowCount][3].ToString()),
								Title = optionTable.Rows[rowCount][4].ToString(),
								Value = optionTable.Rows[rowCount][5].ToString()
							};

							question.Options.Add(currentQuestionOption);

							rowCount++;
						}
					}
				}
				finally
				{
					dbConnection.Close();
					dbConnection.Dispose();
					sqlQuery.Dispose();
				}
			}

			return questions;
		}

		/// <summary>
		///		Inserts a list of Question Options within a Survey Question
		/// </summary>
		/// <returns>An List of Question, which includes Options within the Question object</returns>
		internal List<Question> InsertOptions(List<Question> questions)
		{
			foreach (var question in questions)
			{
				// if the question is not new, remove the current options and re-add them
				// in order to handle for an edit, and insert scenario
				if (question.Options.Count > 0 && !question.IsNew)
				{
					RemoveOptions(question.SurveyId, question.Id);
				}

				foreach (var option in question.Options)
				{
					var connectionString = Utilities.Utilities.GetConnectionStringAzure();
					var dbConnection = new SqlConnection(connectionString);
					var sqlQuery = new SqlCommand
					{
						Connection = dbConnection,
						CommandText = @"INSERT INTO [Option] (SurveyId, QuestionId, SortOrder, Title, Value) 
											VALUES (@surveyId, @questionId, @sortOrder, @title, @value)"
					};

					var surveyIdParam = new SqlParameter
					{
						ParameterName = "@surveyId",
						Value = question.SurveyId
					};

					var questionIdParam = new SqlParameter
					{
						ParameterName = "@questionId",
						Value = question.Id
					};

					var sortOrderParam = new SqlParameter
					{
						ParameterName = "@sortOrder",
						Value = option.SortOrder
					};

					var titleParam = new SqlParameter
					{
						ParameterName = "@title",
						Value = option.Title
					};

					var valueParam = new SqlParameter
					{
						ParameterName = "@value",
						Value = option.Value
					};

					sqlQuery.Parameters.Add(surveyIdParam);
					sqlQuery.Parameters.Add(questionIdParam);
					sqlQuery.Parameters.Add(sortOrderParam);
					sqlQuery.Parameters.Add(titleParam);
					sqlQuery.Parameters.Add(valueParam);

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
		///		Removes any question options for a given question within a survey
		/// </summary>
		internal void RemoveOptions(int surveyId, int questionId)
		{
			var connectionString = Utilities.Utilities.GetConnectionStringAzure();

			var dbConnection = new SqlConnection(connectionString);
			var sqlQuery = new SqlCommand { Connection = dbConnection };

			try
			{
				sqlQuery.CommandText = @"DELETE FROM [Option]
											WHERE QuestionId = @questionId
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