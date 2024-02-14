import { FastifyReply, FastifyRequest } from 'fastify'
import { findPersonalTrainerByEmailCpf } from './login.repository'
import { verifyPassword } from '../../../utils/hash'
import { server } from '../../../app'
import { invalidLogin, LoginInput } from '../../../utils/common.schema'
import { replyErrorDefault } from '../../../utils/error'

export async function loginHandler(
  request: FastifyRequest<{
    Body: LoginInput
  }>,
  reply: FastifyReply
) {
  const body = request.body
  const email = body.email

  try {
    const user = await findPersonalTrainerByEmailCpf(email)

    if (!user) return reply.code(401).send(invalidLogin)

    const correctPassword = await verifyPassword({
      candidatePassword: body.password,
      salt: user.salt,
      hash: user.password
    })

    const { id, name, role } = user
    const userData = { id, name, role }

    // const expiresIn = 60 * 120;
    const accessToken = server.jwt.sign(userData)

    return reply.code(200).send({ accessToken })
  } catch (e: any) {
    return reply.code(401).send(invalidLogin)
  }
}
