import {FastifyInstance} from "fastify";
import {$ref, trainingIdSchema} from "./training.schema";
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

  server.post(trainingRoutesPath.register, {
    preHandler: [server.authenticate, server.authorizationLimited],
    schema: {
      tags: [tags.training],
      summary: trainingSummary.register,
      body: $ref('trainingCreateSchema'),
      response: {
        201: $ref('trainingCreateSchema')
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