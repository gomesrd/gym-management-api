import {default as fastify, FastifyInstance, FastifyRequest} from 'fastify';
import {Env} from './config/env';
import {JWT} from "@fastify/jwt";

declare module "@fastify/jwt" {
    interface FastifyJWT {
        user: {
            "id": string;
            "name": string;
            "email": string;
            "role": string;
        }
    }
}


declare module "fastify" {
    export interface FastifyRequest {
        jwt: JWT;
    }

    export interface FastifyInstance {
        authenticate: any;
        authorizationExclusive: any;
        authorizationLimited: any;
        authorizationMember: any;
        admin: any;
    }
}

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
