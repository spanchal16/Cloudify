const axios = require('axios');

function showError(code, message, res) {
    let error = {
        code: code,
        message: message
    }
    res.view("pages/error", { error: error });
}

function showErrorPart(partId, res) {
    let code = "400";
    let message = "partId: " + partId + " does not exist.";
    showError(code, message, res);
}

module.exports = {
    // GET ALL
    viewData: function (req, res) {
        const sqlSelectAll = `SELECT * FROM jobs`
        sails.sendNativeQuery(sqlSelectAll, function (err, rawResult) {
            let jobs = [];
            for (let [key, value] of Object.entries(rawResult.rows)) {
                let job = {};
                for (let [k, v] of Object.entries(value)) {
                    job[k] = v;
                }
                jobs.push(job);
            }
            if (!jobs) {
                res.send("Cannot find anything to show!")
            }
            if (jobs) {
                res.view("pages/jobs/viewData", { jobs: jobs })
            }
        });
    },
    // GET ONE BY ID
    viewDataByID: async function (req, res) {
        const jobName = req.param('jobName');
        const partId = parseInt(req.param('partId'));
        const sqlSelectOne = `SELECT * FROM jobs WHERE jobName = $1 AND partId = $2`;

        await sails.sendNativeQuery(sqlSelectOne, [jobName, partId], function (err, rawResult) {
            var length = rawResult.rows.length;
            if (length == 0) {
                let code = "400";
                let message = "jobName: " + jobName + " with " + "partId: " + partId + " do not exist, can't retrieve data.";
                showError(code, message, res);
            } else {
                var job = {};
                for (let [key, value] of Object.entries(rawResult.rows)) {
                    for (let [k, v] of Object.entries(value)) {
                        job[k] = v;
                    }
                }
                res.view("pages/jobs/viewDataByID", { job: job });
            }
        });
    },
    // ADD DATA
    addData: async function (req, res) {
        const jobName = req.body.jobName;
        const partId = parseInt(req.body.partId);
        const qty = parseInt(req.body.qty);

        // retrieve part from company Y
        var allPartId = await axios.get("http://companyy-env.eba-2uu3usha.us-east-1.elasticbeanstalk.com/api/listparts")
            .then(async function (res) {
                var allPartId = [];
                for (var i = 0; i < res.data.length; i++) {
                    allPartId.push(res.data[i].id);
                }
                return allPartId;
            });

        // check if part exists in company Y
        for (var i = 0; i < allPartId.length; i++) {
            // if part exists in company Y
            if (partId == allPartId[i]) {
                const sqlSelectOne = `SELECT * FROM jobs WHERE jobName = $1 AND partId = $2`;
                await sails.sendNativeQuery(sqlSelectOne, [jobName, partId], async function (err, rawResult) {
                    var length = rawResult.rows.length;
                    if (length != 0) {
                        let code = "400";
                        let message = "jobName: " + jobName + " with " + "partId: " + partId + " already exist, can't add data";
                        showError(code, message, res);
                    } else {
                        const sqlInsert = `INSERT INTO jobs VALUES ($1, $2, $3)`;
                        await sails.sendNativeQuery(sqlInsert, [jobName, partId, qty]);
                        res.redirect("/jobs/viewData");
                    }
                });
                break;
            }
            // if no part found
            if (i == allPartId.length - 1) {
                // no part found
                showErrorPart(partId, res);
            }
        }
    },
    // UPDATE DATA
    updateData: function (req, res) {
        const jobName = req.body.jobName;
        const partId = parseInt(req.body.partId);
        const qty = parseInt(req.body.qty);

        const sqlSelectOne = `SELECT * FROM jobs WHERE jobName = $1 AND partId = $2`;
        sails.sendNativeQuery(sqlSelectOne, [jobName, partId], async function (err, rawResult) {
            var length = rawResult.rows.length;
            if (length != 0) {
                const sqlUpdate = `UPDATE jobs SET qty = $1 WHERE jobName = $2 AND partId = $3`;
                await sails.sendNativeQuery(sqlUpdate, [qty, jobName, partId]);
                res.redirect("/jobs/viewData");

            } else {
                let code = "400";
                let message = "jobName: " + jobName + " with " + "partId: " + partId + " do not exist, can't update data";
                showError(code, message, res);
            }
        });
    },
    // DELETE DATA
    deleteData: function (req, res) {
        const jobName = req.body.jobName;
        const partId = parseInt(req.body.partId);

        const sqlSelectOne = `SELECT * FROM jobs WHERE jobName = $1 AND partId = $2`;
        sails.sendNativeQuery(sqlSelectOne, [jobName, partId], async function (err, rawResult) {
            var length = rawResult.rows.length;
            if (length != 0) {
                const sqlDelete = `DELETE FROM jobs WHERE jobName = $1 AND partId = $2`;
                await sails.sendNativeQuery(sqlDelete, [jobName, partId]);
                res.redirect("/jobs/viewData");
            } else {
                let code = "400";
                let message = "jobName: " + jobName + " with " + "partId: " + partId + " do not exist, can't delete data";
                showError(code, message, res);
            }
        });
    },

    getAllJobs: async function (req, res) {
        
        // retrieve jobs from aws lambda function
        var result = await axios.get("https://t7zduvjvc2.execute-api.us-east-1.amazonaws.com/test/getalljobs")
            .then(async function (result) {

                return result;
            });
        
        console.log(result["data"])

        return res.json(result["data"]);
    },


    getDiffJobs: async function (req, res) {

        // retrieve jobs from aws lambda function
        var result = await axios.get("https://t7zduvjvc2.execute-api.us-east-1.amazonaws.com/test/getdiffjobs")
            .then(async function (result) {

                return result;
            });
        
        console.log(result["data"])

        return res.json(result["data"]);
    },

    getOneJobp: async function (req, res) {
        
        let queryParam = req.params.jobName;
        // retrieve jobs from aws lambda function
        var result = await axios.get("https://t7zduvjvc2.execute-api.us-east-1.amazonaws.com/test/getonejobp?jobName=" + queryParam)
            .then(async function (result) {

                return result;
            });
        
        //console.log(result["data"])

        return res.json(result["data"]);
    },

}