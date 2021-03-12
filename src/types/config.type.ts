
export interface config {
    configuration : {
      name: String,
      path: String,
      language: String,
      databases: String[],
      databasesInfos: {
        mongo: mongo | {},
        mariadb: mariadb | {},
      },
      options: String[]
    },
    exposed: {
      routes: String[]
    }
  }

interface mongo {
    databaseName: String,
    rootPassword: String,
    address: String
}

interface mariadb {
    databaseName: String,
    rootPassword: String,
    userAccount: String,
    userPassword: String,
    address: String
}