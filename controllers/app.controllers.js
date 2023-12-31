const db = require("../db/connection");
const fs = require("fs/promises");
const { selectAllTopics, selectAllArticles, selectArticleById, selectAllArticleCommentsById, insertArticleIdComment, updateArticleId, removeCommentByCommentID, selectAllUsers } = require("../models/app.models");

exports.getEndpointDescription = (req, res, next) => {
    fs.readFile(`${__dirname}/../endpoints.json`, 'utf8')
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
exports.postArticleIdComment = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;

    insertArticleIdComment(article_id, username, body)
    .then((postedComment)=>{
        res.status(201).send({postedComment});
    }).catch((err)=>{
        next(err);
    })
}
exports.patchArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;

    updateArticleId(article_id, inc_votes)
    .then((patchedArticle)=>{
        res.status(200).send({patchedArticle});
    }).catch((err)=>{
        next(err);
    })
}
exports.deleteCommentByCommentID = (req, res, next) => {
    const { comment_id } = req.params;

    removeCommentByCommentID(comment_id)
    .then((deletedComment)=>{
        res.status(204).send({deletedComment});
    }).catch((err)=>{
        next(err);
    })
}
exports.getAllUsers = (req, res, next) => {
    selectAllUsers()
    .then((users)=>{
        res.status(200).send({users});
    }).catch((err)=>{
        next(err);
    })
}