import {FastifyInstance} from "fastify";
import {
  deletePersonalTrainerHandler,
  getManyPersonalTrainersHandler,
  getUniquePersonalTrainerHandler,
  loginHandler,
  registerPersonalTrainerHandler,
  updatePersonalTrainerHandler
} from "./personalTrainer.service";
import {
  $ref,
  personalTrainerIdSchema,
  queryAllPersonalTrainersSchema
} from "./personalTrainer.schema";
import {personalTrainerRoutesPath, personalTrainerSummary, tags} from "../../utils/enums";
import {
  responseDeleteSchema,
  responseIdSchema, responseInvalidLogin, responsePersonalTrainerExists,
  responsePersonalTrainerNotFound
} from "../../utils/common.schema";


async function personalTrainerRoutes(server: FastifyInstance) {
  server.get(personalTrainerRoutesPath.findAll, {
    preHandler: [server.authenticate, server.authorizationExclusive],
    schema: {
      tags: [tags.personalTrainer],
      summary: personalTrainerSummary.findAll,
      querystring: queryAllPersonalTrainersSchema,
      response: {
        200: $ref('PersonalTrainersManyResponseSchema'),
        202: responsePersonalTrainerNotFound
      },
    },
  }, getManyPersonalTrainersHandler);

  server.get(personalTrainerRoutesPath.findById, {
    preHandler: [server.authenticate, server.authorizationLimited],
    schema: {
      tags: [tags.personalTrainer],
      summary: personalTrainerSummary.findById,
      params: personalTrainerIdSchema,
      response: {
        200: $ref('PersonalTrainerUniqueResponseSchema'),
        202: responsePersonalTrainerNotFound
      }
    },
  }, getUniquePersonalTrainerHandler);

  server.post(personalTrainerRoutesPath.register, {
    preHandler: [server.authenticate, server.authorizationExclusive],
    schema: {
      tags: [tags.personalTrainer],
      summary: personalTrainerSummary.register,
      body: $ref('createPersonalTrainerSchema'),
      response: {
        201: responseIdSchema,
        400: responsePersonalTrainerExists
      }
    }
  }, registerPersonalTrainerHandler);

  server.post(personalTrainerRoutesPath.login, {
    schema: {
      tags: [tags.personalTrainer],
      summary: personalTrainerSummary.login,
      body: $ref('loginSchema'),
      response: {
        200: $ref('loginResponseSchema'),
        401: responseInvalidLogin
      }
    }
  }, loginHandler);

  server.put(personalTrainerRoutesPath.update, {
      preHandler: [server.authenticate, server.authorizationLimited],
      schema: {
        tags: [tags.personalTrainer],
        summary: personalTrainerSummary.update,
        params: personalTrainerIdSchema,
        body: $ref('updatePersonalTrainerSchema'),
        response: {
          200: $ref('updatePersonalTrainerSchema'),
          202: responsePersonalTrainerNotFound
        }
      }
    }, updatePersonalTrainerHandler
  );

  server.delete(personalTrainerRoutesPath.delete, {
      preHandler: [server.authenticate, server.authorizationExclusive],
      schema: {
        tags: [tags.personalTrainer],
        summary: personalTrainerSummary.delete,
        params: personalTrainerIdSchema,
        response: {
          204: responseDeleteSchema,
          202: responsePersonalTrainerNotFound
        }
      }
    }, deletePersonalTrainerHandler
  );
}

export default personalTrainerRoutes;