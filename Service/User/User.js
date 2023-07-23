

class User {

  createUser = (name, password, email, isAuthor) => {
    const insertQuery = "INSERT INTO `Users` (username, password, email, is_author) VALUES (?,?,?,?)";
    let data = [name, password, email, isAuthor];
    console.log(data);

    const sql = Service.get(Service.SQL);
    return sql.add(insertQuery, data);
  }



  // execute sql query
 /* let newrecord = [req.body.username, req.body.password, req.body.email, req.body.is_author];
  db.run(sqlquery, newrecord, (err, result) => {
  if (err) {
    return console.error(err.message);
  }else
  res.send("Your account has been created, <br> <b>Username:</b> "+ req.body.username + "<br><b> Password: </b>"+ req.body.password +" <br><b> email: </b>"+ req.body.email +
  "<br><b>Author:</b> "+ req.body.is_author)
});*/
}


module.exports = User;