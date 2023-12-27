import {FastifyInstance} from "fastify";
import {$ref} from "./training.schema";
import {
  deleteTrainingHandler, getUniqueTrainingHandler, getManyTrainingsHandler, registerTrainingHandler,
  updateTrainingHandler
} from "./training/training.service";
import {registerTrainingReplacementHandler} from "./replacement/trainingReplacement.service";
import {
  tags,
  trainingReplacementRoutesPath,
  trainingReplacementSummary,
  trainingRoutesPath,
  trainingSummary
} from "../../utils/enums";

async function trainingRoutes(server: FastifyInstance) {
  server.get(trainingRoutesPath.findAll, {
    preHandler: [server.authenticate],
    schema: {
      tags: [tags.training],
      summary: trainingSummary.findAll,
      querystring: {
        type: 'object',
        properties: {
          id: {type: 'string'},
          member_id: {type: 'string'},
          personal_trainer_id: {type: 'string'},
        }
      },
      response: {
        200: $ref('trainingFindManyScheme')
      }
    }
  }, getManyTrainingsHandler);

  server.get(trainingRoutesPath.findById, {
    preHandler: [server.authenticate],
    schema: {
      tags: [tags.training],
      summary: trainingSummary.findById,
      params: {
        id: {type: 'string'},
      },
      response: {
        200: $ref('trainingFindUniqueSchema')
      }
    },
  }, getUniqueTrainingHandler);

  server.post(trainingRoutesPath.register, {
    preHandler: [server.authenticate, server.authorizationLimited],
    schema: {
      tags: [tags.training],
      summary: trainingSummary.register,
      body: $ref('createTrainingSchema'),
      response: {
        201: $ref('createTrainingSchema')
      }

    }
  }, registerTrainingHandler);

  server.post(trainingReplacementRoutesPath.register, {
    preHandler: [server.authenticate, server.authorizationLimited],
    schema: {
      tags: [tags.training_replacement],
      summary: trainingReplacementSummary.register,
      body: $ref('createTrainingReplacementSchema'),
      response: {
        201: {
          type: 'object',
          properties: {
            id: {type: 'string', example: ''}
          }
        }
      }
    }
  }, registerTrainingReplacementHandler);

  server.put(trainingRoutesPath.update, {
      preHandler: [server.authenticate, server.authorizationLimited],
      schema: {
        tags: [tags.training],
        summary: trainingSummary.update,
        params: {
          id: {type: 'string'},
        },
        body: $ref('updateTrainingSchema'),
        response: {
          200: $ref('updateTrainingSchema')
        },

      }
    }, updateTrainingHandler
  );

  server.delete(trainingRoutesPath.delete, {
      preHandler: [server.authenticate, server.authorizationExclusive],
      schema: {
        tags: [tags.training],
        summary: trainingSummary.delete,
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
    }, deleteTrainingHandler
  );
}

export default trainingRoutes;