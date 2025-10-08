// ------------------ PostgreSQL ------------------
import fs from "fs";
import pkg from "pg";
const { Pool } = pkg;

// ✅ Create a connection pool
export const connectPGDB = new Pool({
  host: process.env.PG_HOST || "localhost",
  port: process.env.PG_PORT ? parseInt(process.env.PG_PORT) : 5432, // <-- fixed variable name
  user: process.env.PG_USER || "postgres",
  password: process.env.PG_PASSWORD || "postgres",
  database: process.env.PG_DATABASE || "node-boilerplate", // <-- always include DB name
  ssl:
    process.env.PG_HOST && process.env.PG_HOST !== "localhost"
      ? {
          rejectUnauthorized: true,
          ca: fs.existsSync("global-bundle.pem")
            ? fs.readFileSync("global-bundle.pem").toString()
            : undefined,
        }
      : false,
  // max: 10, // optional - connection pool size
  // idleTimeoutMillis: 30000, // optional - auto close idle connections
});

// ✅ Function to verify connection
export const PGConnection = async () => {
  try {
    const client = await connectPGDB.connect();
    console.log("✅ PostgreSQL Connected Successfully");
    client.release();
  } catch (err) {
    console.error("❌ PostgreSQL connection failed:", err.message);
    process.exit(1);
  }
};