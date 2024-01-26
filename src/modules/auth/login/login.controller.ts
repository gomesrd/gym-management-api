import {FastifyInstance} from "fastify";
import {loginHandler} from "./login.service";
import {$ref} from "./login.schema";
import {tags, usersPath, usersSummary} from "../../../utils/enumsController";
import {responseInvalidLogin} from "../../../utils/common.schema";


async function authRoutes(server: FastifyInstance) {

  server.post('', {
    schema: {
      tags: [tags.login],
      summary: usersSummary.login,
      body: $ref('loginSchema'),
      response: {
        200: $ref('loginResponseSchema'),
        401: responseInvalidLogin
      }
    }
  }, loginHandler);

}

export default authRoutes;