import {JWT} from '@fastify/jwt'

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
    interface FastifyRequest {
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
