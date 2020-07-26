const express = require("express");
const sls = require("serverless-http");
const { Sequelize } = require("sequelize"); // Sequelize is used as ORM
const app = express();
const url = require("url");

app.use(express.json());

//Making connection to the database
const sequelize = new Sequelize("cloud", "tutorial_user", "052020Aws-Educate", {
  host: "tutorial-db-instance.cy6kirdolrfe.us-east-1.rds.amazonaws.com",
  dialect: "mysql",
});

//Making connection with the database
sequelize
  .authenticate()
  .then(() => console.log("Connected To Database..."))
  .catch((err) => console.log("Error", err));

//List all parts using GET method
app.get("/listparts", (req, res) => {
  sequelize
    .query("select * from parts", { type: Sequelize.QueryTypes.SELECT })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(400).json({
        message: `Something Went Wrong \n ${err}`,
      });
      console.log(err);
    });
});

//Get particular part using GET method
app.get("/getpart", (req, res) => {
  const custom_url = new URL(
    req.protocol + "://" + req.get("host") + req.originalUrl
  );
  const search_param = custom_url.searchParams;
  if (JSON.stringify(req.query) === "{}") {
    res.status(404).json({
      message: "Please enter proper parameter",
    });
  } else if (search_param.has("partid") === false) {
    res.status(404).json({
      message: "Please enter proper parameter",
    });
  } else if (req.query.partid === "") {
    res.status(404).json({
      message: "Please enter proper parameter",
    });
  } else {
    sequelize
      .query(`select * from parts where partId=${req.query.partid};`, {
        type: Sequelize.QueryTypes.SELECT,
      })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(400).json({
          message: `Something Went Wrong \n ${err}`,
        });
        console.log(err);
      });
  }
});

//Get All PartOrders
app.get("/getpartorders", (req, res) => {
  sequelize
    .query("select * from partOrdersY", { type: Sequelize.QueryTypes.SELECT })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(400).json({
        message: `Something Went Wrong \n ${err}`,
      });
      console.log(err);
    });
});

//app.listen(3000, () => console.log(`Listening to port 3000...`));
module.exports.handler = sls(app);
