import { FastifyInstance } from 'fastify'
import { plansRoutesPath, plansSummary, tags } from '../../utils/enumsController'
import { $ref } from './plans.schema'
import {
  deletePlansHandler,
  getManyPlansHandler,
  getUniquePlanHandler,
  registerPlanHandler,
  updatePlansHandler
} from './plans.service'
import { pageableQueryString } from '../../utils/common.schema'

async function plansRoutes(server: FastifyInstance) {
  server.post(
    plansRoutesPath.register,
    {
      preHandler: [server.authenticate, server.authorizationExclusive],
      schema: {
        tags: [tags.plan],
        body: $ref('PlanRegisterSchema'),
        summary: plansSummary.register,
        response: {
          201: {
            type: 'object',
            properties: {
              message: { type: 'string', example: '' }
            }
          }
        }
      }
    },
    registerPlanHandler
  )

  server.get(
    plansRoutesPath.findById,
    {
      preHandler: [server.authenticate, server.authorizationLimited],
      schema: {
        tags: [tags.plan],
        summary: plansSummary.findById,
        params: {
          plan_id: { type: 'string' }
        },
        response: {
          200: $ref('planGetByIdSchema')
        }
      }
    },
    getUniquePlanHandler
  )

  server.get(
    plansRoutesPath.findAll,
    {
      preHandler: [server.authenticate, server.authorizationLimited],
      schema: {
        tags: [tags.plan],
        summary: plansSummary.findAll,
        querystring: {
          type: 'object',
          properties: {
            ...pageableQueryString
          },
          required: ['page', 'pageSize']
        },
        response: {
          200: $ref('plansGetManySchema')
        }
      }
    },
    getManyPlansHandler
  )

  server.put(
    plansRoutesPath.update,
    {
      preHandler: [server.authenticate, server.authorizationExclusive],
      schema: {
        tags: [tags.plan],
        summary: plansSummary.update,
        params: {
          plan_id: { type: 'string' }
        },
        body: $ref('PlanRegisterSchema'),
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
    updatePlansHandler
  )

  server.patch(
    plansRoutesPath.delete,
    {
      preHandler: [server.authenticate, server.authorizationExclusive],
      schema: {
        tags: [tags.plan],
        summary: plansSummary.delete,
        params: {
          plan_id: { type: 'string' }
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
    deletePlansHandler
  )
}

export default plansRoutes
