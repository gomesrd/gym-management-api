import { cleanEnv, str, num } from 'envalid';

const env = cleanEnv(process.env, {
  NODE_ENV: str({ default: 'dev', choices: ['local', 'dev', 'prod', 'docker', 'production']}),
  PORT: num({ default: 3000 }),
  HOST: str({ default: '0.0.0.0' }),
  JWT_SECRET_KEY: str({ default: 'secret' }),
  DATABASE_URL: str({ default: '' }),
});

export default env;

export type Env = typeof env;


