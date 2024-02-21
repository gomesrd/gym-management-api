import { FastifyReply, FastifyRequest } from 'fastify'
import {
  createPersonalTrainer,
  deletePersonalTrainer,
  findManyPersonalTrainers,
  findPersonalTrainerByEmailCpf,
  findPersonalTrainerById,
  findUniquePersonalTrainer,
  updatePersonalTrainer
} from './personalTrainer.repository'
import {
  CreatePersonalTrainerInput,
  PersonalTrainersManyResponse,
  UpdatePersonalTrainer
} from './personalTrainer.schema'
import { hashPassword, verifyPassword } from '../../utils/hash'
import { server } from '../../app'
import { parseFiltersPermission, parseFiltersTraining } from '../../utils/parseFilters'
import { queryUserRole } from '../../utils/permissions.service'
import { PersonalTrainerId } from '../../utils/types'
import {
  Filters,
  invalidLogin,
  LoginInput,
  personalTrainerExists,
  personalTrainerNotFound
} from '../../utils/common.schema'
import { replyErrorDefault } from '../../utils/error'
import { cognitoCreateAccount } from '../../config/aws/cognitoAuth'

export async function getManyPersonalTrainersHandler(
  request: FastifyRequest<{
    Querystring: Filters
  }>,
  reply: FastifyReply
): Promise<PersonalTrainersManyResponse | undefined> {
  const userId = request.user.id
  const filters = request.query
  const parseFilters = await parseFiltersTraining(filters, userId)

  try {
    const findPersonalTrainers = await findManyPersonalTrainers(filters, parseFilters)

    if (!findPersonalTrainers) {
      return reply.code(204).send(personalTrainerNotFound)
    }

    return reply.code(200).send(findPersonalTrainers)
  } catch (e) {
    console.log(e)

    return replyErrorDefault(reply)
  }
}

export async function getUniquePersonalTrainerHandler(
  request: FastifyRequest<{
    Params: PersonalTrainerId
  }>,
  reply: FastifyReply
) {
  const userId = request.user.id
  const personalTrainerId = request.params.personal_trainer_id
  const filters = await parseFiltersPermission(userId, personalTrainerId)

  try {
    const findPersonalTrainer = await findUniquePersonalTrainer(filters)

    if (!findPersonalTrainer) {
      return reply.code(202).send(personalTrainerNotFound)
    }

    return reply.code(200).send(findPersonalTrainer)
  } catch (e) {
    console.log(e)

    return replyErrorDefault(reply)
  }
}

export async function registerPersonalTrainerHandler(
  request: FastifyRequest<{
    Body: CreatePersonalTrainerInput
  }>,
  reply: FastifyReply
) {
  const body = request.body
  const password = body.password
  const { cpf, email, role, name } = body

  const personalTrainer = await findPersonalTrainerByEmailCpf(email, cpf)
  if (personalTrainer) return reply.code(400).send(personalTrainerExists)

  try {
    const createUserCognito = await cognitoCreateAccount({
      username: email,
      password: password,
      role: role,
      name: name
    })

    if (!createUserCognito) return reply.code(500).send('Error creating user in cognito')

    const { userSub } = createUserCognito

    const personalTrainer = await createPersonalTrainer(body, userSub)

    return reply.code(201).send(personalTrainer)
  } catch (e: any) {
    console.log(e)

    return replyErrorDefault(reply)
  }
}

export async function loginHandler(
  request: FastifyRequest<{
    Body: LoginInput
  }>,
  reply: FastifyReply
) {
  const body = request.body
  const email = body.email
  const personalTrainer = await findPersonalTrainerByEmailCpf(email)

  if (!personalTrainer) return reply.code(401).send(invalidLogin)

  try {
    const { id, name, role } = personalTrainer
    const personalTrainerData = { id, name, role }

    // const expiresIn = 60 * 120;
    const accessToken = server.jwt.sign(personalTrainerData)

    return reply.code(200).send({ accessToken, personalTrainerData })
  } catch (e) {
    console.log(e)

    return replyErrorDefault(reply)
  }
}

export async function updatePersonalTrainerHandler(
  request: FastifyRequest<{
    Body: UpdatePersonalTrainer
    Params: PersonalTrainerId
  }>,
  reply: FastifyReply
) {
  const userId = request.user.id
  const dataUpdate = request.body
  const personalTrainerId = request.params.personal_trainer_id
  const userRole = await queryUserRole(userId)

  if (userRole !== 'admin' && userId !== personalTrainerId)
    return reply.code(403).send('You can only update your own data')

  const personalTrainer = await findPersonalTrainerByIdHandler(personalTrainerId)

  if (!personalTrainer) return reply.code(202).send(personalTrainerNotFound)

  try {
    const update = updatePersonalTrainer(dataUpdate, personalTrainerId)

    return reply.code(200).send(update)
  } catch (e) {
    console.log(e)

    return replyErrorDefault(reply)
  }
}

export async function deletePersonalTrainerHandler(
  request: FastifyRequest<{
    Params: PersonalTrainerId
  }>,
  reply: FastifyReply
) {
  const personalTrainerId = request.params.personal_trainer_id
  const personalTrainer = await findPersonalTrainerByIdHandler(personalTrainerId)
  if (!personalTrainer) return reply.code(202).send(personalTrainerNotFound)

  try {
    await deletePersonalTrainer(personalTrainerId)

    return reply.code(204).send('')
  } catch (e) {
    console.log(e)

    return replyErrorDefault(reply)
  }
}

export async function findPersonalTrainerByIdHandler(personalTrainerId: string) {
  return await findPersonalTrainerById(personalTrainerId)
}
