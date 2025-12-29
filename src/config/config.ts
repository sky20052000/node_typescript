
interface Config {
  ACCESS_TOKEN: string;
  REFRESH_TOKEN: string;
  ACCESS_TOKEN_EXPIRATION: string;
  REFRESH_TOKEN_EXPIRATION: string;
  PORT:number;
  HOST: string;
  RESET_PASSWORD_URL: string;
  USER_EMAIL: string;
  USER_PASS: string;
  DATABASE_USERNAME: string;
  DATABASE_HOSTNAME: string;
  DATABASE_NAME: string;
  DATABASE_PASSWORD: string;
  DATABASE_PORT: number;
  CLOUD_NAME: string;
  API_KEY: string;
  API_SECRET: string;
  NODE_ENV:string;
}

const _config: Record<keyof Config, string | undefined> = {
  ACCESS_TOKEN: process.env.ACCESS_TOKEN,
  REFRESH_TOKEN: process.env.REFRESH_TOKEN,
  ACCESS_TOKEN_EXPIRATION: process.env.ACCESS_TOKEN_EXPIRATION,
  REFRESH_TOKEN_EXPIRATION: process.env.REFRESH_TOKEN_EXPIRATION,
  PORT: process.env.PORT,
  HOST: process.env.HOST,
  RESET_PASSWORD_URL: process.env.RESET_PASSWORD_URL,
  USER_EMAIL: process.env.USER_EMAIL,
  USER_PASS: process.env.USER_PASS,
  DATABASE_USERNAME: process.env.DatabaseUserName,
  DATABASE_HOSTNAME: process.env.DatabaseHostName,
  DATABASE_NAME: process.env.DatabaseName,
  DATABASE_PASSWORD: process.env.DatabasePassword,
  DATABASE_PORT: process.env.DataBasePort,
  CLOUD_NAME: process.env.CLOUD_NAME,
  API_KEY: process.env.API_KEY,
  API_SECRET: process.env.API_SECRET,
  NODE_ENV:process.env.NODE_ENV,
};
export const config = {
  get<K extends keyof Config>(key: K): Config[K] {
    const value = _config[key];

    if (value === undefined || value === '') {
      console.error(`Missing required environment variable: ${key}`);
      process.exit(1);
    }
    return value as Config[K];
  },
};