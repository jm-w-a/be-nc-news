const db = require("../connection");
const fs = require("fs/promises");
const { selectAllTopics, selectArticleById } = require("../models/app.models");

exports.getEndpointDescription = (req, res) => {
    fs.readFile(`${__dirname}/../../endpoints.json`, 'utf8')
    .then((descriptions) => {
        const endPoints = JSON.parse(descriptions)
        res.status(200).send({endPoints});
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
exports.getArticleById = (req, res) => {
    const { article_id } = req.params;

    selectArticleById(article_id)
    .then((article)=>{
        res.status(200).send({article});
    }).catch((err)=>{
        console.log(err);
    })
}