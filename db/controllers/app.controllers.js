const db = require("../connection");
const fs = require("fs/promises");
const { selectAllTopics } = require("../models/app.models");

exports.getEndpointDescription = (req, res) => {
    fs.readFile(`${__dirname}/../../endpoints.json`, 'utf8')
    .then((descriptions) => {
        const parsedDescriptions = JSON.parse(descriptions)
        res.status(200).send({parsedDescriptions});
    }).catch((err)=>{
        console.log(err);
    })
}

exports.getAllTopics = (req, res) => {
    selectAllTopics()
    .then((topics)=>{
        res.status(200).send({topics});
    }).catch((err)=>{
        console.log(err);
    })
}