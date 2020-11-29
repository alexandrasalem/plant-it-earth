# plant-it-earth

## Notes: 
- `npm run devstart` will run the server with nodemon 

## File structure:
- controllers: helper-function implementations for get/post reqs for different routes (querying databases, making api calls, etc...)
- routes: request calls for different routes (app.get(...), app.post(...), etc...), when implemented these will call the functions in /controllers/
- views: visual implementation for the pages (planning on using pug templates, currently using html)
- app.js: this is the main file handling all of the different routes

## Database:
- The application is connected to GCP PSQL instance.

## Data Scripts for Database creation: 
## Data Script for data extraction: 
