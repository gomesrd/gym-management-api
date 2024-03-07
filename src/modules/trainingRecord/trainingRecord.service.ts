import { FastifyReply, FastifyRequest } from 'fastify'
import {
  CreateTrainingRecordInput,
  DeleteTrainingRecord,
  GetTrainingRecord,
  TrainingRecordsQueryString,
  UpdateTrainingRecord
} from './trainingRecord.schema'
import {
  createTrainingRecord,
  deleteTrainingRecord,
  findUniqueTrainingRecord,
  findManyTrainingRecords,
  updateTrainingRecord,
  findManyTrainingRecordsStatus
} from './trainingRecord.repository'
import { personalTrainerValidate } from '../../utils/permissions.service'
import { deleteTraining, findUniqueTraining } from '../training/training/training.repository'
import { parseFiltersPermission, parseFiltersTraining } from '../../utils/parseFilters'
import {
  createTrainingReplacement,
  updateRealizedTrainingReplacement
} from '../training/replacement/trainingReplacement.repository'
import { Filters } from '../../utils/common.schema'

export async function registerTrainingRecordHandler(
  request: FastifyRequest<{
    Body: CreateTrainingRecordInput
  }>,
  reply: FastifyReply
) {
  const body = request.body
  const userId = request.user.id
  const parseFilters = await parseFiltersPermission(userId)
  const trainingType = body.type
  const replacement = body.replacement
  const status = body.status
  const trainingReplacementId = body.training_replacement_id

  // TODO: refactor to use personalTrainerValidate
  // const invalidRequest = await personalTrainerValidate(userId)
  // if (invalidRequest) {
  //   return reply.code(403).send(invalidRequest)
  // }

  try {
    if (trainingType === 'plan' && replacement && status === 'foul') {
      await createTrainingRecord(body)
      const findMembersIdTraining = await findUniqueTraining(body.training_id, parseFilters)
      const member_id = findMembersIdTraining?.members?.map(member => member.id) as [string, ...string[]]
      if (member_id) {
        await createTrainingReplacement({ member_id })

        return reply.code(201).send('')
      }
    }

    if (trainingType === 'replacement') {
      const trainingRecord = await createTrainingRecord(body)
      await deleteTraining(body.training_id, parseFilters)
      await updateRealizedTrainingReplacement(trainingReplacementId as string, { status: 'realized' })

      return reply.code(201).send(trainingRecord)
    }

    // else if (trainingType === 'singular') {
    //  const trainingRecord = await createTrainingRecord(body)
    //   await deleteTraining(body.training_id, parseFilters)
    //   return reply.code(201).send(trainingRecord)
    // }
    else {
      const trainingRecord = await createTrainingRecord(body)

      return reply.code(201).send(trainingRecord)
    }
  } catch (e) {
    console.log(e)

    return reply.code(500).send('Something went wrong')
  }
}

export async function getManyTrainingRecordsHandler(
  request: FastifyRequest<{
    Querystring: Filters
  }>,
  reply: FastifyReply
) {
  const userId = request.user.id
  const filters = request.query
  const parseFilters = await parseFiltersTraining(filters, userId)

  try {
    const findMany = await findManyTrainingRecords(filters, parseFilters)

    return reply.code(200).send(findMany)
  } catch (e: any) {
    console.log(e)
  }
}

export async function getManyTrainingRecordsStatusHandler(
  request: FastifyRequest<{
    Querystring: Filters
  }>,
  reply: FastifyReply
) {
  const filters = request.query

  try {
    const findMany = await findManyTrainingRecordsStatus(filters)

    return reply.code(200).send(findMany)
  } catch (e: any) {
    console.log(e)
  }
}

export async function getUniqueTrainingRecordHandler(
  request: FastifyRequest<{
    Params: { training_record_id: string }
  }>,
  reply: FastifyReply
) {
  const userId = request.user.id
  const trainingRecordId = request.params.training_record_id
  const parseFilters = await parseFiltersPermission(userId)

  try {
    const findUnique = await findUniqueTrainingRecord(trainingRecordId, parseFilters)

    return reply.code(200).send(findUnique)
  } catch (e: any) {
    console.log(e)
  }
}

export async function updateTrainingRecordHandler(
  request: FastifyRequest<{
    Body: UpdateTrainingRecord
    Params: { training_record_id: string }
  }>,
  reply: FastifyReply
) {
  const trainingRecordId = request.params.training_record_id
  const dataUpdate = request.body

  try {
    const update = await updateTrainingRecord(trainingRecordId, dataUpdate)

    return reply.code(200).send(update)
  } catch (e: any) {
    console.log(e)
  }
}

export async function deleteTrainingRecordHandler(
  request: FastifyRequest<{
    Params: { training_record_id: string }
  }>,
  reply: FastifyReply
) {
  const trainingRecordId = request.params.training_record_id

  try {
    await deleteTrainingRecord(trainingRecordId)

    return reply.code(200).send('')
  } catch (e: any) {
    console.log(e)
  }
}
