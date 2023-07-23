
class Sql {

  /** returns last inserted id of new record */
  add = (query, data) => {
    return new Promise((resolve, reject) => {
      db.run(query, data, function (err, result) {
        if (err) {
          reject(err);
          return;
        }
        console.log(this.lastID);
        resolve(this.lastID);
      });
    });
  }

  fetch = (query, params = []) => {
    return new Promise((resolve, reject) => {
      db.all(query, params, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }

  fetchOne = (query, params = []) => {
    return new Promise((resolve, reject) => {
      db.get(query, params, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }
}

module.exports = Sql;
