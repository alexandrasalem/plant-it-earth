# plant-it-earth

## Notes: 
    - <npm run devstart> will run the server with nodemon 
    
## File structure:
    -controllers: helper-function implementations for get/post reqs for different routes
    -routes: request calls for different routes (app.get(...), app.post(...), etc...), when implemented these will call the functions in /controllers/
    -views: visual implementation for the pages (planning on using pug templates, currently using html)
    -app.js: this is the main file handling all of the different routes
