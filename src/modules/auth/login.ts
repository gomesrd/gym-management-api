import fjwt, {JWT} from '@fastify/jwt';
import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";

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
        Admin: any;
    }
}


export async function loginServer(server: FastifyInstance) {
    server.register(fjwt, {
        secret: 'rQPCnFcBDV84hPqTNGcHAzCKfFfJY3thFnUgHsCf',
    });
    server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                await request.jwtVerify()
            } catch (e) {
                return reply.send(e)
            }
        }
    );

}