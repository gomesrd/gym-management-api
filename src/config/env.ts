import {cleanEnv, str, num,} from 'envalid';

const env = cleanEnv(process.env, {
    NODE_ENV: str({choices: ['local', 'dev', 'prod']}),
    PORT: num({default: 8080}),
    HOST: str({default: '0.0.0.0'}),
    DB_URL: str(),
});

export type Env = typeof env;

export default env;
