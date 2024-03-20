import { FastifyInstance } from 'fastify'
import { plansRoutesPath, plansSummary, tags } from '../../utils/enumsController'
import {
  deletePlansHandler,
  getListPlansHandler,
  getManyPlansHandler,
  getUniquePlanHandler,
  registerPlanHandler,
  updatePlansHandler
} from './plans/plans.service'
import { pageableQueryString } from '../../utils/common.schema'
import { $ref as $refSubscription } from './subscriptions/subscriptions.schema'
import { registerPlanSubscriptionHandler } from './subscriptions/subscriptions.service'
import { $ref } from './plans/plans.schema'

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

  server.get(
    plansRoutesPath.findAllList,
    {
      preHandler: [server.authenticate, server.authorizationLimited],
      schema: {
        tags: [tags.plan],
        summary: plansSummary.findAllList,
        response: {
          200: $ref('plansGetListSchema')
        }
      }
    },
    getListPlansHandler
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

  server.post(
    plansRoutesPath.subscriptions,
    {
      preHandler: [server.authenticate, server.authorizationExclusive],
      schema: {
        tags: [tags.plan],
        body: $refSubscription('planSubscriptionBodySchema'),
        summary: plansSummary.subscription,
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
    registerPlanSubscriptionHandler
  )
}

export default plansRoutes
