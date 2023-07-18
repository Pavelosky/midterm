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

app.get('/', (req, res) => {
  // Render the home.ejs file
  res.render('home');
  })

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

app.get('/authors_page', (req, res) => {
  // Render the home.ejs file
  res.render('authors_page');
})

app.get('/authors_settings', (req, res) => {
  // Render the home.ejs file
  res.render('authors_settings');
})

app.get('/edit_article', (req, res) => {
  // Render the home.ejs file
  res.render('edit_article');
})

app.get('/index', (req, res) => {
  res.render('index')
});

//this adds all the userRoutes to the app under the path /user
app.use('/user', userRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

