const PartsController = require("../api/controllers/PartsController");
const PartOrdersYController = require("../api/controllers/PartOrdersYController");

module.exports.routes = {
  //Lists all parts on the homepage
  "/": { view: "pages/homepage" },
  "GET /": PartsController.list,

  //Add new part using (UI)
  "GET /addpart": { view: "pages/addpart" },
  "POST /addpart": PartsController.create,

  //Edit particular part using partId (UI)
  "GET /editpart/:partId": PartsController.editpart,
  "POST /editpart": PartsController.update,

  //Search particular part using partId (UI)
  "GET /searchpart": { view: "pages/searchpart" },
  "POST /searchpart": PartsController.search,

  //List all orderedParts using (UI)
  "/partsorder": { view: "pages/orderedparts" },
  "GET /partsorder": PartOrdersYController.list,

  //Get all parts using (API)
  "GET /api/listparts": PartsController.listAllParts,

  //Update particular part using (API)
  "POST /api/editpart": PartsController.edit,

  //Search particular part using (API)
  "GET /api/part/:partId": PartsController.searchPart,

  //Add new partsorder entry using (API)
  "POST /api/addorders": PartOrdersYController.addList,

  "GET /error": { view: "error" },
  "GET /notfound": { view: "pages/notfound" },
};
