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
        if (response.status === 200) {
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
  addList: async function (req, res) {
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
      await axios({
        method: "post",
        url: `https://c8yyanelhf.execute-api.us-east-1.amazonaws.com/production/addorders?jobname=${req.query.jobname}&partid=${req.query.partid}&userid=${req.query.userid}&qty=${req.query.qty}`,
      })
        .then((response) => {
          if (response.status === 200) {
            return res.ok();
          } else {
            return res.view("error", { err: response.data });
          }
        })
        .catch((err) => {
          return res.view("error", { err: err });
        });
    }
  },
};
