import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

// const connection = await mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   database: "doutya",
//   password: "jinoJINO"
// });
// https://247.163.178.68.host.secureserver.net:2083/

const connection = await mysql.createConnection({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME
});

export const db = drizzle(connection);

