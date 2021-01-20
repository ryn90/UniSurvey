using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace UniSurvey.WebAPI.Models
{
	class QuestionResultRepository
	{
		/// <summary>
		///		Retrieves Questions by Survey ID for the Question Result Object
		/// </summary>
		/// <returns>Question Result Object</returns>
		public List<QuestionResult> GetQuestions(int surveyId)
		{
			var connectionString = Utilities.Utilities.GetConnectionStringAzure();

			var dbConnection = new SqlConnection(connectionString);
			var sqlQuery = new SqlCommand { Connection = dbConnection };

			var questionResults = new List<QuestionResult>();

			try
			{
				sqlQuery.CommandText = @"SELECT 
											Id, SurveyId, SortOrder, Title, Type, Required 
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
						var currentQuestion = new QuestionResult
						{
							QuestionId = Convert.ToInt32(questionTable.Rows[rowCount][0].ToString()),
							SurveyId = Convert.ToInt32(questionTable.Rows[rowCount][1].ToString()),
							SortOrder = Convert.ToInt32(questionTable.Rows[rowCount][2].ToString()),
							Title = questionTable.Rows[rowCount][3].ToString(),
							QuestionType = questionTable.Rows[rowCount][4].ToString(),
							IsRequired = Convert.ToBoolean(questionTable.Rows[rowCount][5].ToString()),
							Values = new List<string>(),
							OptionTitles = new List<string>(),
							OptionValues = new List<string>(),
							OptionSelectionCounts = new List<int>()
						};

						questionResults.Add(currentQuestion);

						rowCount++;
					}

					return questionResults;
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
		///		Retrieves Questions' Options if they are Radio or Dropdown 
		///		so that their counts can be updated for their options. Nothing 
		///		is done in the case of text field or text area, as all the data will need to be
		///		added as an individual result.
		/// </summary>
		/// <returns>Question Result Object</returns>
		public List<QuestionResult> GetQuestionOptions(List<QuestionResult> questions)
		{
			if (questions == null)
			{
				return null;
			}

			foreach (var question in questions)
			{
				if (question.QuestionType == "radio" || question.QuestionType == "dropdown")
				{

					var connectionString = Utilities.Utilities.GetConnectionStringAzure();

					var dbConnection = new SqlConnection(connectionString);
					var sqlQuery = new SqlCommand {Connection = dbConnection};

					try
					{
						sqlQuery.CommandText = @"SELECT 
												Title, Value
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
							Value = question.QuestionId
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
								question.OptionTitles.Add(optionTable.Rows[rowCount][0].ToString());
								question.OptionValues.Add(optionTable.Rows[rowCount][1].ToString());

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
			}

			return questions;
		}

		/// <summary>
		///		Retrieves Questions Results for the list of questions
		/// </summary>
		/// <returns>Question Result Object, with question results</returns>
		public List<QuestionResult> GetQuestionResults(List<QuestionResult> questions)
		{
			if (questions == null)
			{
				return null;
			}

			foreach (var question in questions)
			{
				if (question.QuestionType == "textfield" || question.QuestionType == "textarea")
				{
					var connectionString = Utilities.Utilities.GetConnectionStringAzure();

					var dbConnection = new SqlConnection(connectionString);
					var sqlQuery = new SqlCommand
					{
						Connection = dbConnection,
						CommandText = @"SELECT 
												Value 
											FROM 
												[Submission]
											WHERE 
												SurveyId = @surveyId
											AND 
												QuestionId = @questionId"
					};


					var surveyIdParam = new SqlParameter
					{
						ParameterName = "@surveyId",
						Value = question.SurveyId
					};

					var questionIdParam = new SqlParameter
					{
						ParameterName = "@questionId",
						Value = question.QuestionId
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
							question.Values.Add(optionTable.Rows[rowCount][0].ToString());

							rowCount++;
						}
					}
				}
				else if (question.QuestionType == "radio" || question.QuestionType == "dropdown")
				{
					if (question.OptionTitles != null)
					{
						var optionCount = 0;
						foreach (var option in question.OptionTitles)
						{
							var connectionString = Utilities.Utilities.GetConnectionStringAzure();

							var dbConnection = new SqlConnection(connectionString);
							var sqlQuery = new SqlCommand
							{
								Connection = dbConnection,
								CommandText = @"SELECT 
													count(VALUE) AS Occurrence 
												FROM 
													[Submission]
												WHERE 
													SurveyId = @surveyId
												AND 
													QuestionId = @questionId
												AND 
													Value = @value"
							};


							var surveyIdParam = new SqlParameter
							{
								ParameterName = "@surveyId",
								Value = question.SurveyId
							};

							var questionIdParam = new SqlParameter
							{
								ParameterName = "@questionId",
								Value = question.QuestionId
							};

							var valueParam = new SqlParameter
							{
								ParameterName = "@value",
								Value = question.OptionValues[optionCount]
							};

							sqlQuery.Parameters.Add(surveyIdParam);
							sqlQuery.Parameters.Add(questionIdParam);
							sqlQuery.Parameters.Add(valueParam);

							dbConnection.Open();

							optionCount++;
							var sqlReader = sqlQuery.ExecuteReader();

							if (sqlReader.HasRows)
							{
								DataTable resultTable = new DataTable();
								resultTable.Load(sqlReader);

								var rowCount = 0;

								foreach (DataRow row in resultTable.Rows)
								{
									question.OptionSelectionCounts.Add(Convert.ToInt32(resultTable.Rows[rowCount][0].ToString()));
									rowCount++;
								}
							}
						}
					}
				}
			}

			return questions;
		} 
	}
}
