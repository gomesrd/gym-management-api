import {cleanEnv, str, num,} from 'envalid';
import dotenv from 'dotenv';

dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

const env = cleanEnv(process.env, {
    NODE_ENV: str({choices: ['local', 'dev', 'prod']}),
    PORT: num({default: 3000}),
    HOST: str({default: 'localhost'}),
    DATABASE_URL: str(),
});

export type Env = typeof env;

export default env;
