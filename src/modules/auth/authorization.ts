import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {
  verifyPermissionAdmin,
  verifyPermissionMember,
  verifyPermissionPersonalTrainer
} from "../../utils/permissions.service";
import {noPermissionAction} from "../../utils/common.schema";

export async function authorizationServer(server: FastifyInstance) {
  server.decorate('authorizationExclusive', async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user.id;
    try {
      await verifyPermissionAdmin(userId);

    } catch (e: any) {
      if (e.code === 403) return reply.code(401).send(noPermissionAction);
    }
  });

  server.decorate('authorizationLimited', async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user.id;
    try {
      await verifyPermissionPersonalTrainer(userId);

    } catch (e: any) {
      if (e.code === 403) return reply.code(401).send(noPermissionAction);
    }
  });

  server.decorate('authorizationMember', async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user.id;
    try {
      await verifyPermissionMember(userId);

    } catch (e: any) {
      if (e.code === 403) return reply.code(401).send(noPermissionAction);
    }
  })
}