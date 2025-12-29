import { config } from "./config.js"; 
import {Pool} from 'pg'


export const pool = new Pool({
  user:config.get('DATABASE_USERNAME'),
  host: config.get('DATABASE_HOSTNAME'),
  database:config.get('DATABASE_NAME'),
  password:config.get('DATABASE_PASSWORD'),
  port:config.get('DATABASE_PORT'),
  max: 20, 
  ssl: process.env.NODE_ENV === 'Production' 
    ? { rejectUnauthorized: false }
    : false
});


pool.query('SELECT 1')
  .then(() => {
    console.log("Connected to PostgreSQL via connection pool!");
  })
  .catch((err) => {
    console.error("PG Pool Connection Error:", err);
  });