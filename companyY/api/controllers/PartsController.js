//serverless endpoint url: https://c8yyanelhf.execute-api.us-east-1.amazonaws.com/production
const axios = require("axios");
module.exports = {
  // To display all parts
  list: async function (req, res) {
    await axios({
      method: "get",
      url:
        "https://c8yyanelhf.execute-api.us-east-1.amazonaws.com/production/listparts",
    })
      .then((response) => {
        if (!response.data.message) {
          return res.view("pages/homepage", { parts: response.data });
        } else {
          return res.view("error", { err: response.data });
        }
      })
      .catch((err) => {
        return res.view("error", { err: err });
      });
  },

  //To create new part
  create: function (req, res) {
    Parts.create({
      id: req.body.txtpartid,
      partName: req.body.txtpartname,
      qoh: req.body.txtqoh,
    })
      .then(function () {
        return res.redirect("/");
      })
      .catch(function (err) {
        return res.view("error", { err: err });
      });
  },

  //To fetch existing part
  editpart: function (req, res) {
    Parts.findOne({
      id: req.params.partId,
    })
      .then(function (parts) {
        return res.view("pages/editpart", { parts: parts });
      })
      .catch(function (err) {
        return res.view("error", { err: err });
      });
  },

  //To update part
  update: function (req, res) {
    Parts.update(
      {
        id: req.body.txtpartid,
      },
      {
        partName: req.body.txtpartname,
        qoh: req.body.txtqoh,
      }
    )
      .then(function () {
        res.redirect("/");
      })
      .catch(function (err) {
        return res.view("error", { err: err });
      });
  },

  //To search part
  search: function (req, res) {
    Parts.findOne({
      id: req.body.txtpartid,
    })
      .then(function (parts) {
        if (!parts) {
          return res.view("pages/searchpart", { parts: null });
        } else {
          return res.view("pages/searchpart", { parts: parts });
        }
      })
      .catch(function (err) {
        return res.view("error", { err: err });
      });
  },

  //To list all parts using (API)
  listAllParts: async function (req, res) {
    await axios({
      method: "get",
      url:
        "https://c8yyanelhf.execute-api.us-east-1.amazonaws.com/production/listparts",
    })
      .then((response) => {
        if (!response.data.message) {
          return res.status(200).json(response.data);
        } else {
          return res.send(500, { error: response.data });
        }
      })
      .catch((err) => {
        return res.send(500, { error: `Something Went Wrong!\n${err}` });
      });
  },

  //Edit particular part using (API)
  edit: function (req, res) {
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
      search_param.has("partid") === false ||
      search_param.has("qoh") === false
    ) {
      res.status(404).json({
        message: "Please enter proper parameter",
      });
    } else if (req.query.partid === "" || req.query.qoh === "") {
      res.status(404).json({
        message: "Please enter proper parameter",
      });
    } else {
      Parts.update(
        {
          id: req.query.partid,
        },
        {
          qoh: req.query.qoh,
        }
      )
        .then(function () {
          return res.ok();
        })
        .catch(function (err) {
          return res.send(500, { error: `Something Went Wrong!\n${err}` });
        });
    }
  },

  //Search particular part using (API)
  searchPart: async function (req, res) {
    await axios({
      method: "get",
      url: `https://c8yyanelhf.execute-api.us-east-1.amazonaws.com/production/getpart?partid=${req.params.partid}`,
    })
      .then((response) => {
        if (!response.data.message) {
          return res.status(200).json(response.data);
        } else {
          return res.send(500, { error: response.data });
        }
      })
      .catch((err) => {
        return res.send(500, { error: `Something Went Wrong!\n${err}` });
      });
  },
};
