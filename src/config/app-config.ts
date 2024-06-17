export interface EnvironmentVariables {
  env: string;
  appName: string;
  http: {
    port: number;
    host: string;
  };
  database: {
    host: string;
    port: number;
    user: string;
    password: string;
    name: string;
  };
}

export const appConfig = (): EnvironmentVariables => ({
  env: process.env.NODE_ENV,
  appName: process.env.APP_NAME || 'NestJS API Starter',

  http: {
    port: parseInt(process.env.PORT, 10) || 3000,
    host: process.env.APP_HOST || 'localhost',
  },

  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
});
