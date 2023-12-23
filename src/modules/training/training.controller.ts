import {FastifyInstance} from "fastify";
import {$ref} from "./training.schema";
import {
  deleteTrainingHandler, getUniqueTrainingHandler, getManyTrainingsHandler, registerTrainingHandler,
  updateTrainingHandler
} from "./training.service";

async function trainingRoutes(server: FastifyInstance) {
  server.get('', {
    preHandler: [server.authenticate],
    schema: {
      tags: ['Training'],
      summary: 'Get all trainings',
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

  server.get('/:id', {
    preHandler: [server.authenticate],
    schema: {
      tags: ['Training'],
      summary: 'Get a specific training',
      params: {
        id: {type: 'string'},
      },
      response: {
        200: $ref('trainingFindUniqueSchema')
      }
    },
  }, getUniqueTrainingHandler);

  server.post('', {
    preHandler: [server.authenticate, server.authorizationLimited],
    schema: {
      tags: ['Training'],
      body: $ref('createTrainingSchema'),
      summary: 'Create a new training',
      response: {
          201: $ref('createTrainingSchema')
      }

    }
  }, registerTrainingHandler);

  server.put('/:id', {
      preHandler: [server.authenticate, server.authorizationLimited],
      schema: {
        tags: ['Training'],
        summary: 'Update a specific training',
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

  server.delete('/:id', {
      preHandler: [server.authenticate, server.authorizationExclusive],
      schema: {
        tags: ['Training'],
        summary: 'Delete a specific training',
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