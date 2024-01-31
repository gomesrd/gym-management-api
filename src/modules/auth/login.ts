import fjwt, {JWT} from '@fastify/jwt';
import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {Env} from "../../config/env";

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
    authorizationExclusive: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    authorizationLimited: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    authorizationMember: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    Admin: any;
  }
}


export async function loginServer(server: FastifyInstance) {
  server.register(fjwt, {
    secret: process.env.JWT_SECRET_KEY as string,
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