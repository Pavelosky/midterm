/**
 * All Articles routes
 */

const express = require("express");
const Service = require('../Service/Serice');
const router = express.Router();


/**
 *
 * Get single article page
 * bla bla
 */
router.get('/article/:id', (req, res, next) => {

  const articleId = req.params.id;

  const ArticleService = Service.get(Service.ARTICLES);

  ArticleService.getArticleById(articleId)
    .then((article) => {
      console.log('article', article);
      ArticleService.getArticleComments(articleId)
        .then((comments) => {
          res.render('Articles/article', { article, comments: comments });
        });
    });
});


router.post('/article/:id/comment', (req, res, next) => {

  const articleId = req.params.id;
  const authorName = req.body.author_name;
  const email = req.body.email;
  const commentText = req.body.comment;

  const articleService = Service.get(Service.ARTICLES);

  articleService.addCommentToArticle(articleId, authorName, email, commentText)
    .then(() => {
      res.redirect(`/articles/article/${articleId}`);
    });
});


module.exports = router;
