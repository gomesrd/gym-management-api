import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export async function healthCheck(server: FastifyInstance) {
  server.get(
    '/health',
    {
      schema: {
        tags: ['Health-Check'],
        summary: 'Health-Check',
        response: {
          200: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              uptime: { type: 'number' },
              timestamp: { type: 'number' }
            }
          }
        }
      }
    },
    (request: FastifyRequest, reply: FastifyReply) => {
      try {
        reply.code(200).send({
          message: 'OK',
          uptime: process.uptime(),
          timestamp: Date.now()
        })
      } catch (error) {
        reply.code(503).send()
      }
    }
  )
}
