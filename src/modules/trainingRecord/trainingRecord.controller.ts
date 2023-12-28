import {FastifyInstance} from "fastify";
import {$ref} from "./trainingRecord.schema";
import {
  deleteTrainingRecordHandler, getUniqueTrainingRecordHandler, getManyTrainingRecordsHandler,
  registerTrainingRecordHandler, updateTrainingRecordHandler
} from "./trainingRecord.service";
import {tags, trainingRecordRoutesPath, trainingRecordSummary} from "../../utils/enums";

async function trainingRecordRoutes(server: FastifyInstance) {
  server.get(trainingRecordRoutesPath.findAll, {
    preHandler: [server.authenticate],
    schema: {
      tags: [tags.trainingRecord],
      summary: trainingRecordSummary.findAll,
      querystring: {
        type: 'object',
        properties: {
          id: {type: 'string'},
          member_id: {type: 'string'},
          personal_trainer_id: {type: 'string'},
        }
      },
      response: {
        200: $ref('trainingRecordFindManyScheme')
      }
    }
  }, getManyTrainingRecordsHandler);

  server.get(trainingRecordRoutesPath.findById, {
    preHandler: [server.authenticate],
    schema: {
      tags: [tags.trainingRecord],
      summary: trainingRecordSummary.findById,
      params: {
        id: {type: 'string'},
      },
      response: {
        200: {
          type: 'array',
          items: $ref('trainingRecordFindUniqueSchema')
        }
      }
    },
  }, getUniqueTrainingRecordHandler);

  server.post(trainingRecordRoutesPath.register, {
    preHandler: [server.authenticate, server.authorizationLimited],
    schema: {
      tags: [tags.trainingRecord],
      body: $ref('createTrainingRecordSchema'),
      summary: trainingRecordSummary.register,
      response: {
        201: $ref('TrainingRecordIdSchema')
      }
    }
  }, registerTrainingRecordHandler);

  server.put(trainingRecordRoutesPath.update, {
      preHandler: [server.authenticate, server.authorizationExclusive],
      schema: {
        tags: [tags.trainingRecord],
        summary: trainingRecordSummary.update,
        params: {
          id: {type: 'string'},
        },
        body: $ref('updateTrainingRecordSchema'),
        response: {
          200: $ref('updateTrainingRecordSchema')
        },

      }
    }, updateTrainingRecordHandler
  );

  server.delete(trainingRecordRoutesPath.delete, {
      preHandler: [server.authenticate, server.authorizationExclusive],
      schema: {
        tags: [tags.trainingRecord],
        summary: trainingRecordSummary.delete,
        params: {
          id: {type: 'string'},
        },
        response: {
          200: {
            type: 'object',
            properties: {
              message: {type: 'string', example: ''}
            }
          }
        }
      }
    }, deleteTrainingRecordHandler
  );
}

export default trainingRecordRoutes;