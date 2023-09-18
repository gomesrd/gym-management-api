import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";

export async function authorizationServer(server: FastifyInstance) {
    server.decorate('authorizationExclusive', async (request: FastifyRequest, reply: FastifyReply) => {
        const userRole = request.user.role;
        if (verifyUserRole(userRole, ['admin'])) {
            return;
        } else {
            throw new Error('Unauthorized');
        }
    });

    server.decorate('authorizationLimited', async (request: FastifyRequest, reply: FastifyReply) => {
        const userRole = request.user.role;
        if (verifyUserRole(userRole, ['admin', 'personal_trainer'])) {
            return;
        } else {
            throw new Error('Unauthorized');
        }
    });

    server.decorate('authorizationMember', async (request: FastifyRequest, reply: FastifyReply) => {
        const userRole = request.user.role;
        if (verifyUserRole(userRole, ['admin', 'member'])) {
            return;
        } else {
            throw new Error('Unauthorized');
        }
    });
}

export function verifyUserRole(userRole: string, allowedRoles: string[]): boolean {
    return allowedRoles.includes(userRole);
}

