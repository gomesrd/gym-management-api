import { object, z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'

const trainingReport = {
  member: z.object({
    id: z.string(),
    name: z.string()
  }),
  totalRegularTrainingsRealized: z.number(),
  totalTrainingsFoul: z.number(),
  totalTrainingsReplacement: z.number(),
  totalTraining: z.number(),
  totalTrainingsPendingReplacement: z.number()
}
const trainingReportSchema = z.object({
  data: z.object({
    ...trainingReport
  })
})

export type TrainingReport = z.infer<typeof trainingReportSchema>

export const { schemas: trainingReportSchemas, $ref } = buildJsonSchemas(
  {
    trainingReportSchema
  },
  { $id: 'TrainingReportSchemas' }
)
