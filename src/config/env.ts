import { cleanEnv, str, num } from 'envalid';

const env = cleanEnv(process.env, {
  NODE_ENV: str({ default: 'dev', choices: ['local', 'dev', 'prod', 'development', 'docker', 'production']}),
  PORT: num({ default: 80 }),
  HOST: str({ default: '127.0.0.1' }),
  JWT_SECRET_KEY: str({ default: 'secret' }),
  DATABASE_URL: str({ default: '' }),
});

export default env;

export type Env = typeof env;


