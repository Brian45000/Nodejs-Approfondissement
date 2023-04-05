const Article = require("./articles.model");
class ArticlesService {

    getArticles(userID) {
        const articles = Article.find({ user: userID }).populate("user", "-password");
        return articles;
    }
    create(data, userID) {
        const article = new Article(data, userID);
        return article.save();
    }
    update(id, data) {
        return Article.findByIdAndUpdate(id, data, { new: true });
    }
    delete(id) {
        return Article.deleteOne({ _id: id });
    }
}

module.exports = new ArticlesService();
