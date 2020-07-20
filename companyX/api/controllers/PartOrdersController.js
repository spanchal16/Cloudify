const axios = require('axios');

function showError(code, message, res) {
    let error = {
        code: code,
        message: message
    }
    res.view("pages/error", { error: error });
}

// function showErrorJobPart(jobName, partId, res) {
//     let code = "400";
//     let message = "jobName: " + jobName + " or partId: " + partId + " does not exist.";
//     showError(code, message, res);
// }

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
    viewData: function (req, res) {
        const sqlSelectAll = `SELECT * FROM partOrdersX`
        sails.sendNativeQuery(sqlSelectAll, function (err, rawResult) {
            let orders = [];
            for (let [key, value] of Object.entries(rawResult.rows)) {
                let order = {};
                for (let [k, v] of Object.entries(value)) {
                    order[k] = v;
                }
                orders.push(order);
            }
            if (!orders) {
                res.send("Cannot find anything to show!")
            }
            if (orders) {
                res.view("pages/partOrders/viewData", { orders: orders })
            }
        });
    },
    // GET ONE BY ID
    viewDataByID: async function (req, res) {
        const jobName = req.param('jobName');
        const partId = parseInt(req.param('partId'));
        const userId = parseInt(req.param('userId'));

        if (validInt(partId) && validInt(userId)) {
            const sqlSelectOne = `SELECT * FROM partOrdersX WHERE jobName = $1 AND partId = $2 AND userId = $3`;

            await sails.sendNativeQuery(sqlSelectOne, [jobName, partId, userId], function (err, rawResult) {
                var length = rawResult.rows.length;
                if (length == 0) {
                    let code = "400";
                    let message = "jobName: " + jobName + " with " + "partId: " + partId + " with " + "userId: " + userId + " do not exist, can't retrieve data.";
                    showError(code, message, res);
                } else {
                    var order = {};
                    for (let [key, value] of Object.entries(rawResult.rows)) {
                        for (let [k, v] of Object.entries(value)) {
                            order[k] = v;
                        }
                    }
                    res.view("pages/partOrders/viewDataByID", { order: order });
                }
            });
        } else {
            showErrorInvalidInt(res);
        }

    },

    // ADD DATA
    savePartOrders: async function (req, res) {

        // insert in partOrdersX in aws lambda function
        await axios({
            method: 'post',
            url: "https://t7zduvjvc2.execute-api.us-east-1.amazonaws.com/test/savepartorders",
            headers: {},
            data: {
                partId: parseInt(req.body.partId),
                jobName: req.body.jobName,
                userId: parseInt(req.body.userId),
                qty: parseInt(req.body.qty)
            }
        })
            .then(function (response) {
                //console.log(response);
                return res.json(response["data"]);
            })
            .catch(function (error) {
                return res.json({ status: 'unsuccess' });
            });


    },


}