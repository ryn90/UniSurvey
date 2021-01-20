==============================
Uni Survey - Readme File
==============================

------------------------------
Project Authors
------------------------------

Author: 	Ryan Sammut, for the Individual Project (CO7501) as part fulfilment of the MSc in Advanced Software Engineering with the University of Leicester.
Supervisor: 	Dr. Nir Piterman
2nd Marker: 	Prof. Thomas Erlebach

------------------------------
Project Description
------------------------------

Uni Survey is a survey application, targeted for Universities. It was built for the Individual Project (CO7501) as part fulfilment of the MSc in Advanced Software Engineering with the University of Leicester.

------------------------------
Project Architecture 
------------------------------

The solution is split within three sections, with the Client and the WebAPI layers completely decoupled from each other and only interact together via the APIs endpoints: 

- UniSurvey.Client		- Client side of the application, which consists mostly of HTMl5, CSS3, JavaScript and AngularJS which is connecting to the WebAPI layer (explained below)
- UniSurvey.WebAPI		- Middle / Business Layer of the application which is providing an API to the clients which handles retrieving, updating and posting data to the SQL Server database
- UniSurvey.WebAPI.Tests	- Separate tests project for the WebAPI layer, following Microsoft .NET testing standards

------------------------------
Running the Application
------------------------------

- Download Node.js v4 or later on your local machine
- Open the UniSurvey.sln file in Visual Studio 2015
- Build the UniSurvey Solution
- Open Command Line and Change Directory to the UniSurvey.Client folder (UniSurvey\UniSurvey.Client) and type the following: 
	- npm install -g npm
	- npm install -g bower 
	- npm install
	- bower install
- Run the application using the Visual Studio Start button
- The solution should load two pages in your default browser, the index page of the client application and the WebAPI default page

------------------------------
Running Automated Client Tests
------------------------------

- Open Command Line and Change Directory to the UniSurvey.Client folder (UniSurvey\UniSurvey.Client) and type the following:
	- gulp test

------------------------------
Running Automated WebAPI Tests
------------------------------

- Within Visual Studio, right click on the UniSurvey.WebAPI.Tests project and click on 'Run Unit Tests'

------------------------------
Further Documentation
------------------------------

- UniSurvey.Client 	- Documentation is available throughout the code through code comments as well as within the Dissertation
- UniSurvey.WebAPI	- Documentation is available throughout the code through code comments, within the API's site (http://unisurveywebapi.azurewebsites.net/) as well as within the Dissertation

------------------------------
Production Environment
------------------------------

All the layers of the application, being (1) client website, (2) WebAPI and (3) two SQL Server Database (one for the .NET Identity information and another specific for the Survey information required by the application) are hosted on a production environment on Microsoft Azure. These are accessible as follows:

Web Browser: 
- http://unisurvey.azurewebsites.net
- http://unisurveywebapi.azurewebsites.net

Microsoft SQL Server Management Studio (credentials will be provided within the dissertation)
- unisurveyidentity.database.windows.net
- unisurvey.database.windows.net

------------------------------
Support
------------------------------

If any issues are encountered with setting up or using the application, please contact the author at rs493@student.le.ac.uk.

------------------------------
Changelog
------------------------------

1.0.0 (30/08/2016)

Features

- Login / Register
- Logout
- Account Confirmation
- Create survey
- Copy Questions from existing surveys
- Send to Users
- Users Submit survey feedback
- View results of submitted feedback