import {default as fastify, FastifyInstance, FastifyRequest} from 'fastify';
import {Env} from './config/env';

export const server = fastify();

const setupServer = async (): Promise<{
    server: FastifyInstance
    env: Env
}> => {
    const env = require('./config/env').default;
    const router = require('./infra/router').router;
    await router(server);
    return {server, env};
};

export default setupServer;
