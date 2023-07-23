const e = require('express');


class Article {

  constructor() {
    this._sql = Service.get(Service.SQL);
  }

  getAllArticles = () => {
    return this._sql.fetch(this._baseQuery());
  }


  getArticleById = (articleId) => {
    const query = this._baseQuery() + ' WHERE article_id = ?;';
    return this._sql.fetchOne(query, [articleId]);
  }


  getArticleComments = (articleId) => {
    const query = 'SELECT * FROM Comments WHERE article_id = ?;';
    return this._sql.fetch(query, [articleId]);
  }

  addCommentToArticle = (articleId, authorName, email, comment) => {
    const query = 'INSERT INTO Comments (article_id, author_name, email, comment, comment_date) VALUES (?, ?, ?, ?, DATE("now"))';
    const data = [articleId, authorName, email, comment];
    return this._sql.add(query, data);
  }


  _baseQuery = () => {
    return 'SELECT a.*, u.user_id as author_id, u.username as author_name FROM `Articles` a INNER JOIN `Users` u ON a.user_id = u.user_id ';
  }
}


module.exports = Article;
