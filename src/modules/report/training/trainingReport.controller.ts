import { FastifyInstance } from 'fastify'
import { getManyReportTrainingHandler } from './trainingReport.service'
import { tags, trainingReportRoutesPath, trainingReportSummary } from '../../../utils/enumsController'

async function trainingReportRoutes(server: FastifyInstance) {
  server.get(
    trainingReportRoutesPath.findAll,
    {
      preHandler: [server.authenticate, server.authorizationLimited],
      schema: {
        tags: [tags.trainingReport],
        summary: trainingReportSummary.findAll,
        params: {
          type: 'object',
          properties: {
            member_id: { type: 'string' }
          }
        },
        querystring: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            personal_trainer_id: { type: 'string' },
            created_at_gte: { type: 'string' },
            created_at_lte: { type: 'string' }
          }
        }
      }
    },
    getManyReportTrainingHandler
  )
}

export default trainingReportRoutes
