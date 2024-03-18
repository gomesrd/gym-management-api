import { personalTrainerSchemas } from './modules/personalTrainer/personalTrainer.schema'
import { FastifyInstance } from 'fastify'
import { memberSchemas } from './modules/member/member.schema'
import { trainingSchemas } from './modules/training/training.schema'
import { trainingRecordSchemas } from './modules/trainingRecord/trainingRecord.schema'
import { trainingReportSchemas } from './modules/report/training/trainingReport.schema'
import { plansSchemas } from './modules/plans/plans.schema'

export async function responseSchema(server: FastifyInstance) {
  for (const schema of [
    ...personalTrainerSchemas,
    ...memberSchemas,
    ...trainingSchemas,
    ...trainingRecordSchemas,
    ...trainingReportSchemas,
    ...plansSchemas
  ]) {
    server.addSchema(schema)
  }
}
