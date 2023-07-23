/**
 * These are example routes for user management
 * This shows how to correctly structure your routes for the project
 */

const express = require("express");
const router = express.Router();
const Service = require('../Service/Serice');

router.post('/create', (req, res) => {
  const userService = Service.get(Service.USERS);

  userService.createUser(req.body.username, req.body.password, req.body.email, req.body.is_author)
    .then(() => {
      res.send("Your account has been created, <br> <b>Username:</b> "+ req.body.username + "<br><b> Password: </b>"+ req.body.password +" <br><b> email: </b>"+ req.body.email +
        "<br><b>Author:</b> "+ req.body.is_author);
    })
    .catch(() => {
      res.send('Unable to crate user.');
    });
});

module.exports = router;
