import {FastifyInstance} from "fastify";
import {
  deletePersonalTrainerHandler,
  getManyPersonalTrainersHandler,
  getUniquePersonalTrainerHandler,
  loginHandler,
  registerPersonalTrainerHandler,
  updatePersonalTrainerHandler
} from "./personalTrainer.service";
import {$ref, personalTrainerIdSchema, queryAllPersonalTrainersSchema} from "./personalTrainer.schema";
import {personalTrainerRoutesPath, personalTrainerSummary, personalTrainerTag} from "../../utils/enums";


async function personalTrainerRoutes(server: FastifyInstance) {
  server.get(personalTrainerRoutesPath.findAll, {
    preHandler: [server.authenticate, server.authorizationExclusive],
    schema: {
      tags: personalTrainerTag,
      summary: personalTrainerSummary.findAll,
      querystring: queryAllPersonalTrainersSchema,
      response: {
        200: $ref('PersonalTrainersManyResponseSchema'),
      },
    },
  }, getManyPersonalTrainersHandler);

  server.get(personalTrainerRoutesPath.findById, {
    preHandler: [server.authenticate, server.authorizationLimited],
    schema: {
      tags: personalTrainerTag,
      summary: personalTrainerSummary.findById,
      params: personalTrainerIdSchema,
      response: {
        200: $ref('PersonalTrainerUniqueResponseSchema')
      }
    },
  }, getUniquePersonalTrainerHandler);

  server.post(personalTrainerRoutesPath.register, {
    preHandler: [server.authenticate, server.authorizationExclusive],
    schema: {
      tags: personalTrainerTag,
      summary: personalTrainerSummary.register,
      body: $ref('createPersonalTrainerSchema'),
      response: {
        201: {
          type: 'object',
          properties: {
            id: {type: 'string', example: ''}
          }
        }
      }
    }
  }, registerPersonalTrainerHandler);

  server.post(personalTrainerRoutesPath.login, {
    schema: {
      tags: personalTrainerTag,
      summary: personalTrainerSummary.login,
      body: $ref('loginSchema'),
      response: {
        200: $ref('loginResponseSchema')
      }
    }
  }, loginHandler);

  server.put(personalTrainerRoutesPath.update, {
      preHandler: [server.authenticate, server.authorizationLimited],
      schema: {
        tags: personalTrainerTag,
        summary: personalTrainerSummary.update,
        params: personalTrainerIdSchema,
        body: $ref('updatePersonalTrainerSchema'),
        response: {
          200: $ref('updatePersonalTrainerSchema')
        }
      }
    }, updatePersonalTrainerHandler
  );

  server.delete(personalTrainerRoutesPath.delete, {
      preHandler: [server.authenticate, server.authorizationExclusive],
      schema: {
        tags: personalTrainerTag,
        summary: personalTrainerSummary.delete,
        params: personalTrainerIdSchema,
        response: {
          200: {
            type: 'object',
            properties: {
              message: {type: 'string', example: ''}
            }
          }
        }
      }
    }, deletePersonalTrainerHandler
  );
}

export default personalTrainerRoutes;