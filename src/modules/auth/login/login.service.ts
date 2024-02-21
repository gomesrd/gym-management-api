import { FastifyReply, FastifyRequest } from 'fastify'
import { findPersonalTrainerByEmailCpf } from './login.repository'
import { invalidLogin, LoginInput } from '../../../utils/common.schema'
import { CognitoUserSession } from 'amazon-cognito-identity-js'
import { cognitoAuthLogin, ILoginData } from '../../../config/aws/cognitoAuth'

export interface LoggedUser {
  idToken: {
    jwtToken: string
  }
  refreshToken: {
    token: string
  }
}

export async function requestLoginCognito(
  request: FastifyRequest<{
    Body: LoginInput
  }>,
  reply: FastifyReply
) {
  const body = request.body
  const data: ILoginData = {
    username: body.email,
    password: body.password
  }
  const user = await findPersonalTrainerByEmailCpf(body.email)

  if (!user) return reply.code(401).send(invalidLogin)

  const { authenticationDetails, cognitoUserLogin } = cognitoAuthLogin(data)
  try {
    const session: CognitoUserSession = await new Promise((resolve, reject) => {
      cognitoUserLogin.authenticateUser(authenticationDetails, {
        onSuccess: (session: CognitoUserSession) => resolve(session),
        onFailure: (err: any) => reject(err)
      })
    })

    const loggedUser: LoggedUser = {
      idToken: {
        jwtToken: session.getIdToken().getJwtToken()
      },
      refreshToken: {
        token: session.getRefreshToken().getToken()
      }
    }

    reply.code(200).send({ loggedUser })
  } catch (error: any) {
    throw error
  }
}
