module.exports = {
  development: {
    username: 'cmdev',
    password: 'cmdev',
    database: 'cmdev',
    host: 'localhost',
    dialect: 'postgres'
    /*username: 'caremonitorbeta',
    password: ',=wg$6|TYtw4',
    database: 'caremonitorbeta',
    host: 'caremonitorbeta.cgshy2ta5lpn.ap-southeast-2.rds.amazonaws.com',
    dialect: 'postgres'*/
  },
  test: {
    username: "",
    password: "",
    database: "",
    host: '127.0.0.1',
    dialect: 'postgres'
  },
  production: {
    username: "",
    password: "",
    database: "",
    host: "",
    dialect: 'postgres'
  }
}
