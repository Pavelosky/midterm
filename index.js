const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const port = 3000;
const sqlite3 = require('sqlite3').verbose();

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

//set the app to use ejs for rendering
app.set('view engine', 'ejs');

// app.get('/', (req, res) => {
//   // Render the home.ejs file
//   res.render('home');
//   })

app.get("/", function (req, res) {
  //searching in the database
  let sqlquery = "SELECT * FROM `Articles`";
  // execute sql query
  db.all(sqlquery, (err, result) => {
    if (err) {
      return console.error("No articles "
      + req.query.keyword + " error: "+ err.message);
      }else{
      res.render ('home',{availableArticles:result});
    }
  });
});

  app.post("/home", function (req,res) {
    // saving data in database
    console.log(req.body)
    let sqlquery = "INSERT INTO Users (username, password, email, is_author) VALUES (?,?,?,?)";
    // execute sql query
    let newrecord = [req.body.username, req.body.password, req.body.email, req.body.is_author];
    db.run(sqlquery, newrecord, (err, result) => {
    if (err) {
    return console.error(err.message);
    }else
    res.send("Your account has been created, <br> <b>Username:</b> "+ req.body.username + "<br><b> Password: </b>"+ req.body.password +" <br><b> email: </b>"+ req.body.email +
    "<br><b>Author:</b> "+ req.body.is_author)
    });
    });

app.get('/article', (req, res) => {
  // Render the home.ejs file
  res.render('article');
})

  app.post('/submit-comment', (req, res) => {
    const articleId = req.body.article_id;
    const authorName = req.body.author_name;
    const email = req.body.email;
    const commentText = req.body.comment;

    const sqlQuery = 'INSERT INTO Comments (article_id, author_name, email, comment, comment_date) VALUES (?, ?, ?, ?, DATE("now"))';
    const values = [articleId, authorName, email, commentText];
    console.log(values)
    db.run(sqlQuery, values, (err) => {
      if (err) {
        console.error('Error inserting comment:', err.message);
        res.status(500).send('Error submitting comment.');
      } else {
        console.log('Comment inserted successfully.');
        res.redirect('/article-id?id=' + articleId);
      }
    });
  });


app.get('/authors_page', (req, res) => {
  //searching in the database
  let word = `%${req.query.keyword}%`;
  let articlequery = "SELECT * FROM `Articles` WHERE user_id = ?";
  let draftquery = "SELECT * FROM `Drafts` WHERE user_id = ?";
  
  db.serialize(()=>{
    db.all(articlequery,1, (err, articleResults) => {
      if (err) {
        return console.error("No keyword found in any of the articles "
        + req.query.keyword + " error: "+ err.message);
        }
        db.all(draftquery, 1, (err, draftResults) => {
          if (err) {
            return console.error("Error fetching comment data: " + err.message);
          }
          console.log("Article result:");
          console.log(articleResults);
          console.log("Comment result:");
          console.log(draftResults);
          res.render('authors_page', {publishedArticles:articleResults, draftArticles: draftResults });
        });
      })
    });
  });

app.get('/authors_settings', (req, res) => {
  // Render the home.ejs file
  res.render('authors_settings');
})

app.get('/edit_article', (req, res) => {
  // Render the home.ejs file
  res.render('edit_article');
})

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

app.get("/article-id", function (req, res) {
  //searching in the database
  let id = `${req.query.id}`;
  let sqlquery = "SELECT * FROM `Articles` WHERE article_id = ?;";
  let commentquery = "SELECT * FROM Comments WHERE article_id = ?;"

  db.serialize(() => {
    db.all(sqlquery, id, (err, articleResults) => {
      if (err) {
        return console.error("Error fetching article data: " + err.message);
      } 
      db.all(commentquery, id, (err, commentResults) => {
        if (err) {
          return console.error("Error fetching comment data: " + err.message);
        }
        console.log("Article result:");
        console.log(articleResults);
        console.log("Comment result:");
        console.log(commentResults);
        res.render('article', { article: articleResults, comments: commentResults });
      });
    });
  });
});

app.get('/index', (req, res) => {
  res.render('index')
});

//this adds all the userRoutes to the app under the path /user
app.use('/user', userRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

