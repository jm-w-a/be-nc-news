const db = require("../connection");
const fs = require("fs/promises");
const { selectAllTopics, selectAllArticles, selectArticleById, selectAllArticleCommentsById } = require("../models/app.models");

exports.getEndpointDescription = (req, res, next) => {
    fs.readFile(`${__dirname}/../../endpoints.json`, 'utf8')
    .then((descriptions) => {
        const endPoints = JSON.parse(descriptions)
        res.status(200).send({endPoints});
    }).catch((err)=>{
        next(err);
    })
}
exports.getAllTopics = (req, res, next) => {
    selectAllTopics()
    .then((topics)=>{
        res.status(200).send({topics});
    }).catch((err)=>{
        next(err);
    })
}
exports.getAllArticles = (req, res, next) => {
    selectAllArticles()
    .then((articles)=>{
        res.status(200).send({articles});
    }).catch((err)=>{
        next(err);
    })
}
exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;

    selectArticleById(article_id)
    .then((article)=>{
        res.status(200).send({article});
    }).catch((err)=>{
        next(err);
    })
}
exports.getAllArticleCommentsById = (req, res, next) => {
    const { article_id } = req.params;

    selectAllArticleCommentsById(article_id)
    .then((comments)=>{
        res.status(200).send({comments});
    }).catch((err)=>{
        next(err);
    })
}