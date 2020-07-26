const axios = require("axios");

module.exports = {
  //To display all orders
  list: async function (req, res) {
    await axios({
      method: "get",
      url:
        "https://c8yyanelhf.execute-api.us-east-1.amazonaws.com/production/getpartorders",
    })
      .then((response) => {
        if (!response.data.message) {
          return res.view("pages/orderedparts", { partOrders: response.data });
        } else {
          return res.view("error", { err: response.data });
        }
      })
      .catch((err) => {
        return res.view("error", { err: err });
      });
  },

  //Add new parts ordered using (API)
  addList: function (req, res) {
    const url = require("url");
    const custom_url = new URL(
      req.protocol + "://" + req.get("host") + req.originalUrl
    );
    console.log(custom_url);
    const search_param = custom_url.searchParams;
    if (JSON.stringify(req.query) === "{}") {
      res.status(404).json({
        message: "Please enter proper parameter",
      });
    } else if (
      search_param.has("jobname") === false ||
      search_param.has("partid") === false ||
      search_param.has("userid") === false ||
      search_param.has("qty") === false
    ) {
      res.status(404).json({
        message: "Please enter proper parameter",
      });
    } else if (
      req.query.jobname === "" ||
      req.query.partid === "" ||
      req.query.userid === "" ||
      req.query.qty === ""
    ) {
      res.status(404).json({
        message: "Please enter proper parameter",
      });
    } else {
      PartOrdersY.create({
        id: req.query.jobname,
        partId: req.query.partid,
        userId: req.query.userid,
        qty: req.query.qty,
      })
        .then(function () {
          return res.ok();
        })
        .catch(function (err) {
          return res.send(500, { error: `Something Went Wrong!\n${err}` });
        });
    }
  },
};
