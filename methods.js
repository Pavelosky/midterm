

function getTestUsers(query, route) {
    router.get(route, (req, res, next) => {

    //Use this pattern to retrieve data
    //NB. it's better NOT to use arrow functions for callbacks with this library
    global.db.all(query, function (err, rows) {
      if (err) {
        next(err); //send the error on to the error handler
      } else {
        res.json(rows);
      }
    });
  });
}




    
    // Use this pattern to retrieve data
    // NB. it's better NOT to use arrow functions for callbacks with this library
    global.db.all(query, function (err, rows) {
      if (err) {
        route.next(err); // Send the error on to the error handler
      } else {
        route.res.json(rows);
      }
    });
  }