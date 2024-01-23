import {FastifyInstance} from "fastify";
import {
  $ref,
  queryStringTrainingReplacement,
  trainingIdSchema,
  trainingReplacementIdSchema
} from "./training.schema";
import {
  deleteTrainingHandler, getUniqueTrainingHandler, getManyTrainingsHandler, registerTrainingHandler,
  updateTrainingHandler
} from "./training/training.service";
import {
  getManyTrainingsReplacementHandler, getUniqueTrainingReplacementHandler,
  registerTrainingReplacementHandler
} from "./replacement/trainingReplacement.service";
import {
  tags,
  trainingReplacementRoutesPath,
  trainingReplacementSummary,
  trainingRoutesPath,
  trainingSummary
} from "../../utils/enumsController";
import {queryStringTraining, responseDeleteSchema, responseIdSchema} from "../../utils/common.schema";

async function trainingRoutes(server: FastifyInstance) {
  server.get(trainingRoutesPath.findAll, {
    preHandler: [server.authenticate],
    schema: {
      tags: [tags.training],
      summary: trainingSummary.findAll,
      querystring: queryStringTraining,
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
      params: trainingIdSchema,
      response: {
        200: $ref('trainingFindUniqueSchema')
      }
    },
  }, getUniqueTrainingHandler);

  server.get(trainingReplacementRoutesPath.findAll, {
    preHandler: [server.authenticate],
    schema: {
      tags: [tags.trainingReplacement],
      summary: trainingReplacementSummary.findAll,
      querystring: queryStringTrainingReplacement,
      response: {
        200: $ref('trainingReplacementFindManyScheme')
      }
    }
  }, getManyTrainingsReplacementHandler);

  server.get(trainingReplacementRoutesPath.findById, {
    preHandler: [server.authenticate],
    schema: {
      tags: [tags.trainingReplacement],
      summary: trainingReplacementSummary.findById,
      params: trainingReplacementIdSchema,
      response: {
        200: $ref('trainingReplacementFindUniqueSchema')
      }
    },
  }, getUniqueTrainingReplacementHandler);

  server.post(trainingRoutesPath.register, {
    preHandler: [server.authenticate, server.authorizationLimited],
    schema: {
      tags: [tags.training],
      summary: trainingSummary.register,
      body: $ref('trainingCreateSchema'),
      response: {
        201: {
          type: 'string',
          description: ''
        }
      }

    }
  }, registerTrainingHandler);

  server.post(trainingReplacementRoutesPath.register, {
    preHandler: [server.authenticate, server.authorizationLimited],
    schema: {
      tags: [tags.trainingReplacement],
      summary: trainingReplacementSummary.register,
      body: $ref('trainingReplacementCreateSchema'),
      response: {
        201: responseIdSchema
      }
    }
  }, registerTrainingReplacementHandler);

  server.put(trainingRoutesPath.update, {
      preHandler: [server.authenticate, server.authorizationLimited],
      schema: {
        tags: [tags.training],
        summary: trainingSummary.update,
        params: trainingIdSchema,
        body: $ref('trainingUpdateSchema'),
        response: {
          200: $ref('trainingUpdateSchema')
        },
      }
    }, updateTrainingHandler
  );

  server.delete(trainingRoutesPath.delete, {
      preHandler: [server.authenticate, server.authorizationExclusive],
      schema: {
        tags: [tags.training],
        summary: trainingSummary.delete,
        params: trainingIdSchema,
        response: {
          200: responseDeleteSchema
        }
      }
    }, deleteTrainingHandler
  );
}

export default trainingRoutes;