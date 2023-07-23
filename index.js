const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const port = 3100;
const sqlite3 = require('sqlite3').verbose();

const Service = require('./Service/Serice');
global.Service = Service;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//items in the global namespace are accessible throught out the node application
global.db = new sqlite3.Database('./database.db',function(err){
  if(err){
    console.error(err);
    process.exit(1); //Bail out we can't connect to the DB
  }else{
    console.log("Database connected");
    global.db.run("PRAGMA foreign_keys=ON"); //This tells SQLite to pay attention to foreign key constraints
  }
});


const userRoutes = require('./routes/user');
const articleRoutes = require('./routes/articles');

//set the app to use ejs for rendering
app.set('view engine', 'ejs');

app.get("/", function (req, res) {

  Service.get(Service.ARTICLES).getAllArticles()
    .then((availableArticles) => {
      res.render ('Home/home',{availableArticles});
    });
});


app.get('/authors_page', (req, res) => {
  //searching in the database
  const articlequery = "SELECT * FROM `Articles`;";
  const draftquery = "SELECT * FROM `Drafts`;";
  
  db.serialize(()=>{
    db.all(articlequery, (err, articleResults) => {
      if (err) {
        return console.error("No keyword found in any of the articles "
        + req.query.keyword + " error: "+ err.message);
        }
        db.all(draftquery, (err, draftResults) => {
          if (err) {
            return console.error("Error fetching comment data: " + err.message);
          }
          res.render('authors_page', {publishedArticles:articleResults, draftArticles: draftResults });
        });
      })
    });
  });
  
  app.post('/delete-article', (req, res) => {
    const articleId = req.body.article_id;

    const sqlQuery = 'DELETE FROM Articles WHERE article_id = ?;';
    db.run(sqlQuery, articleId, (err) => {
      if (err) {
        console.error('Error deleting article:', err.message);
        res.status(500).send('Error deleting article.');
      } else {
        console.log('Article deleted successfully.');
        res.redirect('/authors_page');
      }
    });
  });

  app.post('/delete-draft', (req, res) => {
    const draftId = req.body.draft_id;

    const sqlQuery = 'DELETE FROM Drafts WHERE draft_id = ?;';
    db.run(sqlQuery, draftId, (err) => {
      if (err) {
        console.error('Error deleting article:', err.message);
        res.status(500).send('Error deleting article.');
      } else {
        console.log('Draft deleted successfully.');
        res.redirect('/authors_page');
      }
    });
  });

  app.post('/publish-draft', (req, res) => {
    const draftId = req.body.draft_id;
    const sqlQuery = 'INSERT INTO Articles (title, subtitle, content, publication_date, user_id) SELECT title, subtitle, content, DATE("now"), user_id FROM Drafts WHERE draft_id = ?;';
    const deletequery = 'DELETE FROM Drafts WHERE draft_id = ?;';

    db.serialize(()=>{
      db.run(sqlQuery, draftId, (err) => {
        if (err) {
          console.error('Error publishing article:', err.message);
          res.status(500).send('Error publishing article.');
        } 
        db.run(deletequery, draftId, (err) => {
          if (err) {
            console.error('Error deleting article:', err.message);
            res.status(500).send('Error deleteing article.');
          }else {
            console.log('Draft published successfully.');
            res.redirect('/authors_page');
          };  
        });
      });
    });
  });

app.get('/authors_settings', (req, res) => {
  // Render the home.js.ejs file
  res.render('authors_settings');
})

app.get('/edit_draft', (req, res) => {
  //searching in the database
  let id = `${req.query.id}`;
  let sqlquery = "SELECT * FROM `Drafts` WHERE draft_id = ?;";

  db.all(sqlquery, id, (err, articleResults) => {
    if (err) {
      return console.error("Error fetching article data: " + err.message);
    }
    res.render('edit_draft',{availableDraft:articleResults})
  });
});

  app.post('/changed-draft', (req, res) => {
    const {articleTitle, articleSubtitle, articleText, userId, draftId} = req.body;

    const sqlQuery = 'UPDATE Drafts SET title = "?", subtitle = "?", content = "?", publication_date = DATE("now"), user_id = "?" WHERE draft_id = ?;';
    db.run(sqlQuery, [articleTitle, articleSubtitle, articleText, userId, draftId], (err) => {
      if (err) {
        console.error('Error updating article:', err.message);
        res.status(500).send('Error updating article.');
      } else {
        console.log('Article updated successfully.');
        // Redirect to the author's page
        res.redirect('/authors_page');
      }
    });
  });

app.get('/create_draft', (req, res) => {
  // Render the home.js.ejs file
  res.render('create_draft');
})

app.post('/create-draft', (req, res) => {
  const {articleTitle, articleSubtitle, articleText, userId} = req.body;

  const sqlQuery = 'INSERT INTO Drafts (title, subtitle, content, publication_date, user_id) VALUES (?, ?, ?, DATE("now"), ?)';
  db.run(sqlQuery, [articleTitle, articleSubtitle, articleText, userId], (err) => {
    if (err) {
      console.error('Error creating article:', err.message);
      res.status(500).send('Error creating article.');
    } else {
      console.log('Article created successfully.');
      // Redirect to the author's page
      res.redirect('/authors_page');
    }
  });
});

app.get("/search-result-db", function (req, res) {
  //searching in the database
  let word = `%${req.query.keyword}%`;
  let sqlquery = "SELECT * FROM `Articles` WHERE content LIKE ?";
  // execute sql query
  db.all(sqlquery,word, (err, result) => {
    if (err) {
      return console.error("No keyword found in any of the articles "
      + req.query.keyword + " error: "+ err.message);
      }else{
      console.log(word)
      res.render ('list_of_articles',{availableArticles:result});
    }
  });
});


// this adds all the userRoutes to the app under the path /user
app.use('/users', userRoutes);

app.use('/articles', articleRoutes);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

