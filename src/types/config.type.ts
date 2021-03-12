
export interface config {
    configuration : {
      name: string,
      path: string,
      language: string,
      databases: string[],
      databasesInfos: {
        mongo: mongo | {},
        mariadb: mariadb | {},
      },
      options: string[]
    },
    exposed: {
      routes: string[]
    }
  }

interface mongo {
    databaseName: string,
    rootPassword: string,
    address: string
}

interface mariadb {
    databaseName: string,
    rootPassword: string,
    userAccount: string,
    userPassword: string,
    address: string
}