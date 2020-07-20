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

function showErrorInvalidInt(res) {
    let code = "400";
    let message = "Invalid Input";
    showError(code, message, res);
}

const maxInt = 2147483647;
// validate integer
function validInt(number) {
    return !isNaN(number) && parseInt(number) < maxInt && parseInt(number) > 0 && number % 1 == 0;
}

module.exports = {
    // GET ALL
    viewData: async function (req, res) {
        var jobs = await axios.get("https://bxkvavlzoc.execute-api.us-east-1.amazonaws.com/test/getalljobs");
        if (!jobs.data) {
            res.send("Cannot find anything to show!")
        }
        if (jobs.data) {
            res.view("pages/jobs/viewData", { jobs: jobs.data })
        }
    },
    // GET ONE BY ID
    viewDataByID: async function (req, res) {
        const jobName = req.param('jobName');
        const partId = parseInt(req.param('partId'));

        if (validInt(partId)) {
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
        } else {
            showErrorInvalidInt(res);
        }
    },
    // ADD DATA
    addData: async function (req, res) {
        const jobName = req.body.jobName;
        const partId = parseInt(req.body.partId);
        const qty = parseInt(req.body.qty);

        if (validInt(partId) && validInt(qty)) {
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
        } else {
            showErrorInvalidInt(res);
        }
    },
    // UPDATE DATA
    updateData: async function (req, res) {
        const jobName = req.body.jobName;
        const partId = parseInt(req.body.partId);
        const qty = parseInt(req.body.qty);

        if (validInt(partId) && validInt(qty)) {
            const data = { "jobName": jobName, "partId": partId, "qty": qty };

            var result = await axios.post("https://bxkvavlzoc.execute-api.us-east-1.amazonaws.com/test/updatejob", data)
                .then(async function (res) {
                    return res;
                });
            if (result.data.status == "success") {
                res.redirect("/jobs/viewData");
            } else if (result.data.status == "unsuccess") {
                showError(result.data.code, result.data.message, res);
            } else {
                showError(500, "Server Error", res);
            }
        } else {
            showErrorInvalidInt(res);
        }
    },
    // DELETE DATA
    deleteData: async function (req, res) {
        const jobName = req.body.jobName;
        const partId = parseInt(req.body.partId);

        if (validInt(partId)) {
            const data = { "jobName": jobName, "partId": partId };

            var result = await axios.post("https://bxkvavlzoc.execute-api.us-east-1.amazonaws.com/test/deletejob", data)
                .then(async function (res) {
                    return res;
                });
            if (result.data.status == "success") {
                res.redirect("/jobs/viewData");
            } else if (result.data.status == "unsuccess") {
                showError(result.data.code, result.data.message, res);
            } else {
                showError(500, "Server Error", res);
            }
        } else {
            showErrorInvalidInt(res);
        }
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