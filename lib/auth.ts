import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
  plugins: [],
  database: new Pool({
    database: process.env.POSTGRES_DATABASE,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
  }),
  emailAndPassword: {
    enabled: true,
  },
});
