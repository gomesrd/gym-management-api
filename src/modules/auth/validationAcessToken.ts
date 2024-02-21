import fjwt, { FastifyJWT, JWT } from '@fastify/jwt'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { Env } from '../../config/env'
import { email } from 'envalid'
import { CognitoIdentityServiceProvider, config as awsConfig } from 'aws-sdk'
import { CognitoJwtVerifier } from 'aws-jwt-verify'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      id: string
      name?: string
      email?: string
      role?: string | null
    }
  }
}

declare module 'fastify' {
  export interface FastifyRequest {
    jwt: JWT
  }

  export interface FastifyInstance {
    authenticate: any
    authorizationExclusive: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
    authorizationLimited: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
    authorizationMember: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
    Admin: any
  }
}
awsConfig.update({ region: 'us-east-1' })
const cognito = new CognitoIdentityServiceProvider()

export async function validationAcessToken(server: FastifyInstance) {
  server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    const authHeader = request.headers.authorization
    if (!authHeader) {
      return reply.code(401).send({ message: 'Token de acesso não fornecido' })
    }
    const token = authHeader.replace('Bearer ', '')

    const verifier = CognitoJwtVerifier.create({
      userPoolId: 'us-east-1_XqCpDsHSq',
      tokenUse: 'id',
      clientId: 'e4jflpv3k84m3ts6j4i21353r'
    })

    try {
      const payload = await verifier.verify(token)
      if (payload) {
        request.user = {
          id: payload.sub,
          role: payload?.['custom:role'] as string
        }
      }
    } catch (error) {
      console.log('Token not valid!', error)

      return reply.code(401).send({ message: 'Token de acesso inválido' })
    }
  })
}
