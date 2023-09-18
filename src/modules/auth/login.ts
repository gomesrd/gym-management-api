import fjwt from '@fastify/jwt';
import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";

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