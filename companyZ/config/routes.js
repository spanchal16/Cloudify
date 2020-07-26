/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  //Lists all parts on the homepage
  "/": { view: "pages/homepage" },
  "GET /": "JobSearchController.list",

  //Search particular job using jobName (UI)
    "GET /searchjob": { view: "pages/searchjob" },
    "POST /searchjob": "JobSearchController.search",

  //View all parts for particular job

  "GET /viewJob/": "JobSearchController.view",
  "GET /viewJob/:jobName": "JobSearchController.view",

  //Authenticate User
  "GET /authenticateUser": "JobSearchController.authenticateUI",
  "GET /authenticateUser/:jobName": "JobSearchController.authenticateUI",
  "POST /authenticateUser" : "JobSearchController.authenticate",

//Check order fulfillment
"GET /orderResults": "JobSearchController.checkOrder",
  "GET /orderResults/:jobName": "JobSearchController.checkOrder",

//Error
"GET /authError": {view: "pages/authError"},
  
};
