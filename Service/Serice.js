const Article = require('./Article/Article');
const User = require('./User/User');
const Sql = require('./Sql/Sql');

/**
 * Service container
 */
class Service {

  // Names of available services
  static ARTICLES = 'Articles';
  static USERS = 'Users';
  static SQL = 'Sql';

  // private static property of store all services
  static services = {};

  // public static method for get service instance
  static get = (serviceName) => {
    if (!Service.services[serviceName]) {
        switch (serviceName) {
          case Service.ARTICLES:
            Service.services[serviceName] = new Article();
            break;
          case Service.USERS:
            Service.services[serviceName] = new User();
            break;
          case Service.SQL:
            Service.services[serviceName] = new Sql();
            break;
        }
    }

    return Service.services[serviceName];
  }

}

// export Service
module.exports = Service;
