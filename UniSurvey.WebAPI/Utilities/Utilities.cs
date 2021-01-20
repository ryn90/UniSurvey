using System.Collections.Generic;
using System.Configuration;
using System.Net;
using System.Net.Mail;

namespace UniSurvey.WebAPI.Utilities
{
	public class Utilities
	{
		public static string GetConnectionStringAzure()
		{
			var connectionString = ConfigurationManager.ConnectionStrings["UniSurveyAzure"].ConnectionString;
			return connectionString;
		}

		public static string GetConnectionStringMembership()
		{
			var connectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
			return connectionString;
		}

		public static void SendRespondentsEmail(List<string> respondentEmails)
		{
			foreach (var respondentEmail in respondentEmails)
			{
				var message = new MailMessage("no-reply@unisurvey.com", respondentEmail);
				var client = new SmtpClient("smtp.gmail.com", 587)
				{
					DeliveryMethod = SmtpDeliveryMethod.Network,
					UseDefaultCredentials = false,
					Credentials = new NetworkCredential("msc.unisurvey@gmail.com", "IEzhAd6HIxtvxNj98xLE"),
					EnableSsl = true
				};

				message.IsBodyHtml = true;
				message.Subject = "UniSurvey - Survey Request";
				message.Body =
					@"	<!doctype html> 
						<html>
							<head>
								<title>UniSurvey Email</title>
							</head>
							<body>
								<table>
									<tr>
										<td>
											<p>Dear Student, </p>
											<p>
												You have been invited to take part in a course evaluation survey, 
												please login to <a href=""http://unisurvey.azurewebsites.net/"">Uni Survey</a> 
												to complete the survey. 
											</p>
											<p>
												Thanks, <br>
												UniSurvey
											</p>
										</td>
									</tr>
								</table>
							</body>
						</html>";

				client.Send(message);
			}
		}

		public static void SendRegistrationEmail(string email, string userGuid)
		{
			var message = new MailMessage("no-reply@unisurvey.com", email);
			var client = new SmtpClient("smtp.gmail.com", 587)
			{
				DeliveryMethod = SmtpDeliveryMethod.Network,
				UseDefaultCredentials = false,
				Credentials = new NetworkCredential("msc.unisurvey@gmail.com", "IEzhAd6HIxtvxNj98xLE"),
				EnableSsl = true
			};

			message.IsBodyHtml = true;
			message.Subject = "UniSurvey - Registration Confirmation";
			message.Body =
					$@"	<!doctype html> 
						<html>
							<head>
								<title>UniSurvey Email</title>
							</head>
							<body>
								<table>
									<tr>
										<td>
											<p>Dear Student, </p>
											<p>
												Thanks for registering on <a href=""http://unisurvey.azurewebsites.net/"">Uni Survey</a>. Please insert this confirmation code to be able to login:  
											</p>	
											<p>{userGuid}</p>
											<p>
												Thanks, <br>
												UniSurvey
											</p>
										</td>
									</tr>
								</table>
							</body>
						</html>";

			client.Send(message);
		}
	}
}
