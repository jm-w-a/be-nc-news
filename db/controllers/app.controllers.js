// Setup:
const db = require("../connection");
const { selectAllTopics } = require("../models/app.models");

exports.getAllTopics = (req, res) => {
    selectAllTopics()
    .then((topics)=>{
        res.status(200).send({topics});
    })
}