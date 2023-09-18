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

    server.decorate('authorization', async (request: FastifyRequest, reply: FastifyReply) => {

            const hasAuthorization = verifyUserRole(request.user.role);

            if (!hasAuthorization) {
                throw new Error('Unauthorized');
            }

        }
    );

}

export const authorizedRoles = ['admin', 'personal_trainer', 'member'];

export function verifyUserRole(userRole: string): boolean {
    return authorizedRoles.includes(userRole);
}