export default {
    schema: "./utils/schema.js",
    dialect: 'mysql',
    dbCredentials: {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        database: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD
    }
  };
