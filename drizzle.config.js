// export default {
//     schema: "./utils/schema.js",
//     dialect: 'mysql',
//     dbCredentials: {
//         host: process.env.DATABASE_HOST,
//         user: process.env.DATABASE_USER,
//         database: process.env.DATABASE_NAME,
//         password: process.env.DATABASE_PASSWORD
//     }
//   };
require('dotenv').config();


  export default {
    schema: "./utils/schema.js",
    dialect: 'mysql',
    dbCredentials: {
        host: '68.178.163.247',
        user: 'devusr_wowfyuser',
        database: 'devusr_quiz_project',
        password: '###Wowfy123'
    }
  };