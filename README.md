# plant-it-earth
This application is designed to help its users to start learning about gardening with zero prior knowledge. It allows users to:
- search for various information on a specific plant;
- understand how a regional climate can affect planting and harvesting time
- share tips or get information on a specific problem.
 
The application has 6 functional sections:
1. "Home" page - outlines app's main objective, provides instructions on how to use it and provides general gardening tips.
2. "Getting Starting" page - provides structured and in-depth information for any type of gardening (indoor vs outdoor), tools necessary, watering, pruning, etc.
3. "Search Veggies" page - search functionality of the app that takes user input for a search vegetable name and queries the Trefle API and displays any information about it. It also has Q&A form where users can see all prior questions/responses about specific plant and/or ask their own questions.
4.  "Most Popular" page - displays most popular/searched vegetables on the app
5. "Planting In Your Climate" page - educates users on USDA hardiness zones, also allows users to input their zip code in order to find out their hardiness zone, general planting instructions for their climate, and displayed plants that grow easily in their climate.
6. "About Us" page - display information and some funny quiz about this app’s creators. 

## Stack technology
Technology used in the app creation:<br>
### Hosting: 
- heroku app, hosting URL:  plant-it-earth.herokuapp.com<br>
### Front End: 
- CSS
- Bulma 
- Pug<br>
### Back-End:
- Node.js w/ Express.js
- Google Cloud Platform - psql
- Trefle API
- Testing w/ Jest
- Morgan Logger 

## File structure:
- CONTROLLERS: helper-function implementations for get/post reqs for different routes (querying databases, making api calls, etc...)
- ROUTES: request calls for different routes (app.get(...), app.post(...), etc...), when implemented these will call the functions in /controllers/ 
Also, the routes folder contains all data scripts (please see Database section for more details). 
- VIEWS: visual implementation for the pages (planning on using pug templates, currently using html)
- APP.js: this is the main file handling all of the different routes
- CREDITENTIALS.JS is in .gitignore file structure but contains all necessary authorization tokens for the API and database

## Database:
The application is connected to Google Cloud PSQL instance.
- network permissions for DB access set to 0.0.0.0 to ensure open traffic from Heroku and all other authorized users irrelevant form their network association
- connection name: plantit-296404:us-central1:plantit
- relation creation, data import, data modification is performed via data scripts (located in ROUTES folder)
- data script utilizing GCP API

### Data Scripts for Database creation: 
- In order to populate data the app is utilizing databaseCreation.js script. All relations, scema, constrains, types could be found in that file.
### Data Script for data extraction: 
- In order to extract and logically adjust data for usda search, the app is utilizing databaseExtract.js script. It is stored in "routes" folder but could be run independently from the application itself.
### Running Data Scripts (for data creation, import, modification and extraction)
1. Open CL terminal and change directory to the app
2. run `node rotes/[DATASCRIPT FILE]`
3. upon each run review any log messages/errors
4. Run test on the DB
## Instructions on installation/running the app/tests: 
- `npm run devstart` will run the server with nodemon 
- In order to push app into development:
    1. Install Heroku (if you do not have it)
    2. Push "main" branch into "development"
    3. Run `git push heroku deploy:main`
    4. Verify that the build and deployment is successful via accessing this link: plant-it-earth.herokuapp.com
- In order to run tests:
    1. If jest is not installed, then `npm install jest`
    2. Run `nmp test`