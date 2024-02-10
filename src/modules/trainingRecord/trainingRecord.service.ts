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
import { deleteTraining } from '../training/training/training.repository'
import { parseFiltersPermission, parseFiltersTraining } from '../../utils/parseFilters'
import { updateRealizedTrainingReplacement } from '../training/replacement/trainingReplacement.repository'

export async function registerTrainingRecordHandler(
  request: FastifyRequest<{
    Body: CreateTrainingRecordInput
  }>,
  reply: FastifyReply
) {
  const body = request.body
  const userId = request.user.id
  const parseFilters = await parseFiltersPermission(userId)

  // TODO: refactor to use personalTrainerValidate
  // const invalidRequest = await personalTrainerValidate(userId)
  // if (invalidRequest) {
  //   return reply.code(403).send(invalidRequest)
  // }

  try {
    const trainingRecord = await createTrainingRecord(body)

    // TODO: refactor update training replacement to use trainingRecordId
    // if (trainingType === 'replacement' && trainingReplacementId) {
    //   await updateRealizedTrainingReplacement(trainingReplacementId)
    //   await deleteTraining(body.training_id, parseFilters)
    // }

    return reply.code(201).send(trainingRecord)
  } catch (e) {
    console.log(e)

    return reply.code(500).send('Something went wrong')
  }
}

export async function getManyTrainingRecordsHandler(
  request: FastifyRequest<{
    Querystring: TrainingRecordsQueryString
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
    Querystring: TrainingRecordsQueryString
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
