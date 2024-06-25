import { FastifyReply, FastifyRequest } from 'fastify'
import { CreateTrainingInput, UpdateTraining } from '../training.schema'
import {
  createTraining,
  deleteTraining,
  findManyTrainings,
  findUniqueTraining,
  updateTraining
} from './training.repository'
import { Filters } from '../../../utils/common.schema'
import { parseFiltersPermission, parseFiltersTraining } from '../../../utils/parseFilters'
import { TrainingId } from '../../../utils/types'
import { replyErrorDefault } from '../../../utils/error'
import { updateRealizedTrainingReplacement } from '../replacement/trainingReplacement.repository'
import { add, format } from 'date-fns'
import { getUniquePlanSubscriptionMember } from '../../plans/subscriptions/subscriptions.repository'

export async function registerTrainingHandler(
  request: FastifyRequest<{
    Body: CreateTrainingInput
  }>,
  reply: FastifyReply
) {
  const body = request.body
  const { training_replacement_id } = body
  const personalTrainerId = body.personal_trainer_id
  const personalTrainerValidate = personalTrainerId === request.user.id

  if (!personalTrainerValidate) {
    return reply.code(403).send('You can only register trainings for yourself')
  }

  const initialTrainingDate = body.training.training_date
  const planId = body.plan_id
  const plan = await getUniquePlanSubscriptionMember(planId)

  if (!plan) {
    return reply.code(400).send('Plan not found')
  }
  debugger
  const trainingAmount = plan.plan.training_amount

  const daysTraining = [initialTrainingDate]

  for (let i = 0; i < trainingAmount; i++) {
    const newDate = add(new Date(daysTraining[i]), { days: 8 })
    daysTraining.push(format(newDate, 'yyyy-MM-dd'))
  }

  try {
    const create = await createTraining(body, daysTraining)
    if (create && training_replacement_id)
      await updateRealizedTrainingReplacement(training_replacement_id as string, { status: 'scheduled' })

    if (create) return reply.code(201).send('')
  } catch (e: any) {
    return replyErrorDefault(reply)
  }
}

export async function getManyTrainingsHandler(
  request: FastifyRequest<{
    Querystring: Filters
  }>,
  reply: FastifyReply
) {
  const userId = request.user.id
  const filters = request.query
  const parseFilters = await parseFiltersTraining(filters, userId)
  try {
    const findMany = await findManyTrainings(filters, parseFilters)

    return reply.code(200).send(findMany)
  } catch (e) {
    console.log(e)

    return replyErrorDefault(reply)
  }
}

export async function getUniqueTrainingHandler(
  request: FastifyRequest<{
    Params: TrainingId
  }>,
  reply: FastifyReply
) {
  const userId = request.user.id
  const trainingId = request.params.training_id
  const parseFilters = await parseFiltersPermission(userId)

  try {
    const findUnique = await findUniqueTraining(trainingId, parseFilters)

    return reply.code(200).send(findUnique)
  } catch (e) {
    console.log(e)

    return replyErrorDefault(reply)
  }
}

export async function updateTrainingHandler(
  request: FastifyRequest<{
    Body: UpdateTraining
    Params: TrainingId
  }>,
  reply: FastifyReply
) {
  const userId = request.user.id
  const dataUpdate = request.body
  const trainingId = request.params.training_id
  const parseFilters = await parseFiltersPermission(userId)

  try {
    await updateTraining(dataUpdate, trainingId, parseFilters)

    return reply.code(201).send('')
  } catch (e: any) {
    console.log(e)
    if (e.code === 'P2002') {
      return reply.code(400).send({
        message: 'Training already exists'
      })
    }

    return replyErrorDefault(reply)
  }
}

export async function deleteTrainingHandler(
  request: FastifyRequest<{
    Params: TrainingId
  }>,
  reply: FastifyReply
) {
  const userId = request.user.id
  const trainingId = request.params.training_id
  const parseFilters = await parseFiltersPermission(userId)

  try {
    await deleteTraining(trainingId, parseFilters)

    return reply.code(200).send('')
  } catch (e: any) {
    console.log(e)

    return replyErrorDefault(reply)
  }
}

// TODO - É necessário validar se a aula a ser criada não está em um horário já ocupado
// TODO - Treino de reposição só pode ser criado com a presença do replacement_id
