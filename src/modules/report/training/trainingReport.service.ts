import { FastifyRequest } from 'fastify'
import { Filters } from '../../../utils/common.schema'
import { getManyReportTrainingRepository } from './trainingReport.repository'

export async function getManyReportTrainingHandler(
  request: FastifyRequest<{
    Querystring: Filters
    Params: { member_id: string }
  }>
) {
  const memberId = request.params.member_id
  const { id, member_id, personal_trainer_id, created_at_gte, created_at_lte } = request.query
  const filters = {
    id,
    member_id,
    personal_trainer_id,
    created_at_gte,
    created_at_lte
  } as Filters

  return await getManyReportTrainingRepository(filters, memberId)
}
