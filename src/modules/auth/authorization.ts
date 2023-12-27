import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {
  verifyPermissionAdmin,
  verifyPermissionMember,
  verifyPermissionPersonalTrainer
} from "../../utils/permissions.service";

export async function authorizationServer(server: FastifyInstance) {
  server.decorate('authorizationExclusive', async (request: FastifyRequest) => {
    const userId = request.user.id;
    await verifyPermissionAdmin(userId);
  });

  server.decorate('authorizationLimited', async (request: FastifyRequest) => {
    const userId = request.user.id;
    await verifyPermissionPersonalTrainer(userId);
  });

  server.decorate('authorizationMember', async (request: FastifyRequest) => {
    const userId = request.user.id;
    await verifyPermissionMember(userId);
  });
}