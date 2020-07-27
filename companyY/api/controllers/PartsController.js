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
        if (response.status === 200) {
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
  create: async function (req, res) {
    await axios({
      method: "post",
      url: `https://c8yyanelhf.execute-api.us-east-1.amazonaws.com/production/addpart?partid=${req.body.txtpartid}&partname=${req.body.txtpartname}&qoh=${req.body.txtqoh}`,
    })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          return res.redirect("/");
        } else {
          return res.view("error", { err: response.data });
        }
      })
      .catch((err) => {
        return res.view("error", { err: err });
      });
  },

    //To fetch existing part
    editpart: async function (req, res) {
      await axios({
        method: "get",
        url: `https://c8yyanelhf.execute-api.us-east-1.amazonaws.com/production/getpart?partid=${req.params.partid}`,
      })
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            return res.view("pages/editpart", { parts: response.data[0] });
          } else {
            return res.send(500, { error: response.data });
          }
        })
        .catch((err) => {
          return res.send(500, { error: `Something Went Wrong!\n${err}` });
        });
    },
  
    //To update part
    update: async function (req, res) {
      await axios({
        method: "post",
        url: `https://c8yyanelhf.execute-api.us-east-1.amazonaws.com/production/editpart?partid=${req.body.txtpartid}&partname=${req.body.txtpartname}&qoh=${req.body.txtqoh}`,
      })
        .then((response) => {
          if (response.status === 200) {
            res.redirect("/");
          } else {
            return res.send(500, { error: response.data });
          }
        })
        .catch((err) => {
          return res.send(500, { error: `Something Went Wrong!\n${err}` });
        });
    },
  
    //To search part
    search: async function (req, res) {
      await axios({
        method: "get",
        url: `https://c8yyanelhf.execute-api.us-east-1.amazonaws.com/production/getpart?partid=${req.body.txtpartid}`,
      })
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            if (response.data.length !== 0) {
              return res.view("pages/searchpart", { parts: response.data[0] });
            } else {
              return res.view("pages/searchpart", { parts: null });
            }
          } else {
            return res.send(500, { error: response.data });
          }
        })
        .catch((err) => {
          return res.send(500, { error: `Something Went Wrong!\n${err}` });
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
        if (response.status === 200) {
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
  edit: async function (req, res) {
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
      await axios({
        method: "post",
        url: `https://c8yyanelhf.execute-api.us-east-1.amazonaws.com/production/editpart?partid=${req.query.partid}&qoh=${req.query.qoh}`,
      })
        .then((response) => {
          if (response.status === 200) {
            res.redirect("/");
          } else {
            return res.send(500, { error: response.data });
          }
        })
        .catch((err) => {
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
        if (response.status === 200) {
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
