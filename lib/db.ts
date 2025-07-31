import { Client } from "pg";

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

export function getDatabaseConfig(): DatabaseConfig {
  const missingVars: string[] = [];

  const database = process.env.POSTGRES_DATABASE || "postgres";
  const user = process.env.POSTGRES_USER || "username";
  const password = process.env.POSTGRES_PASSWORD || "password";

  if (!database) missingVars.push("POSTGRES_DATABASE");
  if (!user) missingVars.push("POSTGRES_USER");
  if (!password) missingVars.push("POSTGRES_PASSWORD");

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}. Please set these in your environment.`,
    );
  }

  return {
    host: process.env.POSTGRES_HOST || "localhost",
    port: parseInt(process.env.POSTGRES_PORT || "5432"),
    database,
    user,
    password,
  };
}

export async function createDatabaseClient(): Promise<Client> {
  const config = getDatabaseConfig();

  const client = new Client({
    ...config,
    connectionTimeoutMillis: 5000,
  });

  await client.connect();
  return client;
}
