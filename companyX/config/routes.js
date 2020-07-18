module.exports.routes = {
  "/": { view: "pages/homepage" },

  // route for Jobs Table
  // Retrieve data
  "GET /jobs/viewData": "JobsController.viewData",
  "GET /jobs/viewDataByID": "JobsController.viewDataByID",
  // Add data
  "GET /jobs/addData": { view: "pages/jobs/addData" },
  "POST /jobs/addData": "JobsController.addData",
  // Update data
  "GET /jobs/updateData": { view: "pages/jobs/updateData" },
  "POST /jobs/updateData": "JobsController.updateData",
  // Delete data
  "GET /jobs/deleteData": { view: "pages/jobs/deleteData" },
  "POST /jobs/deleteData": "JobsController.deleteData",

  // route for partOrdersX Table
  // Retrieve data
  "GET /partOrders/viewData": "PartOrdersController.viewData",
  "GET /partOrders/viewDataByID": "PartOrdersController.viewDataByID",
  
  // API routes
  "GET /api/getAllJobs": "JobsController.getAllJobs",
  "GET /api/getDiffJobs": "JobsController.getDiffJobs",
  "GET /api/getOneJobp/:jobName": "JobsController.getOneJobp",
  //"POST /api/getOneJob": "JobsController.getOneJob",
  "POST /api/savePartOrders": "PartOrdersController.savePartOrders",

  
  // // Add data
  // "GET /partOrders/addData": { view: "pages/partOrders/addData" },
  // "POST /partOrders/addData": "PartOrdersController.addData",
  // // Update data
  // "GET /partOrders/updateData": { view: "pages/partOrders/updateData" },
  // "POST /partOrders/updateData": "PartOrdersController.updateData",
  // // Delete data
  // "GET /partOrders/deleteData": { view: "pages/partOrders/deleteData" },
  // "POST /partOrders/deleteData": "PartOrdersController.deleteData",
};