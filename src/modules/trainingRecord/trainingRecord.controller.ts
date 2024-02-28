import { FastifyInstance } from 'fastify'
import { $ref } from './trainingRecord.schema'
import {
  deleteTrainingRecordHandler,
  getUniqueTrainingRecordHandler,
  getManyTrainingRecordsHandler,
  registerTrainingRecordHandler,
  updateTrainingRecordHandler,
  getManyTrainingRecordsStatusHandler
} from './trainingRecord.service'
import { tags, trainingRecordRoutesPath, trainingRecordSummary } from '../../utils/enumsController'
import { pageableQueryString } from '../../utils/common.schema'

async function trainingRecordRoutes(server: FastifyInstance) {
  server.get(
    trainingRecordRoutesPath.findAll,
    {
      preHandler: [server.authenticate],
      schema: {
        tags: [tags.trainingRecord],
        summary: trainingRecordSummary.findAll,
        querystring: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            member_id: { type: 'string' },
            personal_trainer_id: { type: 'string' },
            ...pageableQueryString
          },
          required: ['page', 'pageSize']
        },
        response: {
          200: $ref('trainingRecordFindManyScheme')
        }
      }
    },
    getManyTrainingRecordsHandler
  )

  server.get(
    trainingRecordRoutesPath.findAllStatus,
    {
      preHandler: [server.authenticate],
      schema: {
        tags: [tags.trainingRecord],
        summary: trainingRecordSummary.findAllStatus,
        querystring: {
          type: 'object',
          properties: {
            created_at_gte: { type: 'string' },
            created_at_lte: { type: 'string' }
          }
        },
        response: {
          200: $ref('trainingRecordStatusFindManyScheme')
        }
      }
    },
    getManyTrainingRecordsStatusHandler
  )

  server.get(
    trainingRecordRoutesPath.findById,
    {
      preHandler: [server.authenticate],
      schema: {
        tags: [tags.trainingRecord],
        summary: trainingRecordSummary.findById,
        params: {
          training_record_id: { type: 'string' }
        },
        response: {
          200: $ref('trainingRecordFindUniqueSchema')
        }
      }
    },
    getUniqueTrainingRecordHandler
  )

  server.post(
    trainingRecordRoutesPath.register,
    {
      preHandler: [server.authenticate, server.authorizationLimited],
      schema: {
        tags: [tags.trainingRecord],
        body: $ref('createTrainingRecordSchema'),
        summary: trainingRecordSummary.register,
        response: {
          201: $ref('TrainingRecordIdSchema')
        }
      }
    },
    registerTrainingRecordHandler
  )

  server.put(
    trainingRecordRoutesPath.update,
    {
      preHandler: [server.authenticate, server.authorizationExclusive],
      schema: {
        tags: [tags.trainingRecord],
        summary: trainingRecordSummary.update,
        params: {
          id: { type: 'string' }
        },
        body: $ref('updateTrainingRecordSchema'),
        response: {
          200: $ref('updateTrainingRecordSchema')
        }
      }
    },
    updateTrainingRecordHandler
  )

  server.delete(
    trainingRecordRoutesPath.delete,
    {
      preHandler: [server.authenticate, server.authorizationExclusive],
      schema: {
        tags: [tags.trainingRecord],
        summary: trainingRecordSummary.delete,
        params: {
          id: { type: 'string' }
        },
        response: {
          200: {
            type: 'object',
            properties: {
              message: { type: 'string', example: '' }
            }
          }
        }
      }
    },
    deleteTrainingRecordHandler
  )
}

export default trainingRecordRoutes
