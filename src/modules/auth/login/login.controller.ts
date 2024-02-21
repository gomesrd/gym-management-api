import { FastifyInstance } from 'fastify'
import { requestLoginCognito } from './login.service'
import { $ref } from './login.schema'
import { tags, usersSummary } from '../../../utils/enumsController'

async function authRoutes(server: FastifyInstance) {
  server.post(
    '',
    {
      schema: {
        tags: [tags.login],
        summary: usersSummary.login,
        body: $ref('loginSchema'),
        response: {
          200: $ref('loginResponseSchema')
        }
      }
    },
    requestLoginCognito
  )
}

export default authRoutes
