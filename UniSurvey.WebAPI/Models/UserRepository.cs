using System;
using System.Data;
using System.Data.SqlClient;

namespace UniSurvey.WebAPI.Models
{
	public class UserRepository
	{
		/// <summary>
		///		Retrieves the User Object which contains the Acces Level
		/// </summary>
		/// <param name="emailAddress">Email address of logged in user</param>
		/// <returns>User Object</returns>
		internal User GetAccessLevel(string emailAddress)
		{
			var connectionString = Utilities.Utilities.GetConnectionStringAzure();

			var dbConnection = new SqlConnection(connectionString);
			var sqlQuery = new SqlCommand {Connection = dbConnection};

			var retrievedUser = new User();

			try
			{
				sqlQuery.CommandText = @"SELECT email, role, isActive
                                         FROM UserRole 
                                         WHERE email = @email";

				var emailParam = new SqlParameter();
				emailParam.ParameterName = "@email";
				emailParam.Value = emailAddress;

				sqlQuery.Parameters.Add(emailParam);

				dbConnection.Open();

				var sqlReader = sqlQuery.ExecuteReader();

				if (sqlReader.HasRows)
				{
					DataTable userTable = new DataTable();
					userTable.Load(sqlReader);

					retrievedUser.Email = userTable.Rows[0][0].ToString();
					retrievedUser.AccessLevel = Convert.ToInt32(userTable.Rows[0][1].ToString());
					retrievedUser.IsActivated = Convert.ToBoolean(userTable.Rows[0][2].ToString());

					return retrievedUser;
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
		///		Assigns role to the user
		/// </summary>
		/// <param name="user">A User object, which contains details about the users email and access level</param>
		/// <returns>User Object</returns>
		internal User AssignRole(User user)
		{
			var connectionString = Utilities.Utilities.GetConnectionStringAzure();

			var dbConnection = new SqlConnection(connectionString);
			var sqlQuery = new SqlCommand { Connection = dbConnection };

			try
			{
				sqlQuery.CommandText = @"INSERT INTO UserRole (Email, Role, IsActive)
											VALUES (@email, @accessLevel, 0)";

				var emailParam = new SqlParameter
				{
					ParameterName = "@email",
					Value = user.Email
				};

				var accessLevelParam = new SqlParameter
				{
					ParameterName = "@accessLevel",
					Value = user.AccessLevel
				};

				sqlQuery.Parameters.Add(emailParam);
				sqlQuery.Parameters.Add(accessLevelParam);

				dbConnection.Open();

				sqlQuery.ExecuteNonQuery();
			}
			finally
			{
				dbConnection.Close();
				dbConnection.Dispose();
				sqlQuery.Dispose();
			}

			return user;
		}

		/// <summary>
		///		Retrieves User's GUID from the Membership Database
		/// </summary>
		/// <param name="email">Email string, for the user which has registered</param>
		/// <returns>User GUID</returns>
		internal string GetUserGuid(string email)
		{
			var connectionString = Utilities.Utilities.GetConnectionStringMembership();

			var dbConnection = new SqlConnection(connectionString);
			var sqlQuery = new SqlCommand { Connection = dbConnection };

			var userGuid = "";

			try
			{
				sqlQuery.CommandText = @"SELECT Id 
                                         FROM AspNetUsers 
                                         WHERE Email = @email";

				var emailParam = new SqlParameter();
				emailParam.ParameterName = "@email";
				emailParam.Value = email;

				sqlQuery.Parameters.Add(emailParam);

				dbConnection.Open();

				var sqlReader = sqlQuery.ExecuteReader();

				if (sqlReader.HasRows)
				{
					DataTable userTable = new DataTable();
					userTable.Load(sqlReader);

					userGuid = userTable.Rows[0][0].ToString();

					return userGuid;
				}
			}
			finally
			{
				dbConnection.Close();
				dbConnection.Dispose();
				sqlQuery.Dispose();
			}

			return userGuid;
		}

		/// <summary>
		///		Updates the User Role table, in order to set the User's IsActive status to true.
		///		The User may now login. 
		/// </summary>
		internal void ActivateUser(string email)
		{
			var connectionString = Utilities.Utilities.GetConnectionStringAzure();

			var dbConnection = new SqlConnection(connectionString);
			var sqlQuery = new SqlCommand { Connection = dbConnection };

			try
			{
				sqlQuery.CommandText = @"UPDATE UserRole 
											SET IsActive = 1
											WHERE Email = @email";

				var emailParam = new SqlParameter
				{
					ParameterName = "@email",
					Value = email
				};

				sqlQuery.Parameters.Add(emailParam);

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
