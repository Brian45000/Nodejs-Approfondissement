const NotFoundError = require("../../errors/not-found");
const UnauthorizedError = require("../../errors/unauthorized");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const articlesService = require("./articles.service");

class ArticlesController {
    async create(req, res, next) {
        try {
            const userID = req.user.id
            const article = await articlesService.create(req.body, userID);
            req.io.emit("article:create", article);
            res.status(201).json(article);
        } catch (err) {
            next(err);
        }
    }
    async update(req, res, next) {
        try {
            const id = req.params.id;
            const data = req.body;
            const user = req.user;
            if(user.role === "admin"){
                const articleModified = await articlesService.update(id, data);
                articleModified.password = undefined;
                res.json(articleModified);
            }
        } catch (err) {
            next(err);
        }
    }
    async delete(req, res, next) {
        try {
            const id = req.params.id;
            const user = req.user;
            if(user.role === "admin"){
                await articlesService.delete(id);
                req.io.emit("article:delete", { id });
                res.status(204).send();
            }
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new ArticlesController();
