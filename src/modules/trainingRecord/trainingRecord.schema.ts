import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'
import { trainingStatus, trainingTypes } from '../../utils/common.schema'

const trainingRecordId = {
  id: z.string()
}

const trainingRecordDateCreated = {
  created_at: z.date(),
  updated_at: z.date()
}

const trainingRecordInput = {
  type: trainingTypes,
  status: trainingStatus,
  training_id: z.string(),
  personal_trainer_id: z.string(),
  member_id: z.string(),
  training_replacement_id: z.string().nullable().optional(),
  realized: z.boolean().optional().default(true)
}

const trainingRecordCount = {
  count: z.number()
}

const trainingRecordResume = {
  ...trainingRecordId,
  type: trainingTypes,
  status: trainingStatus,
  training_id: z.string(),
  personal_trainer: z.object({
    user: z.object({
      name: z.string(),
      id: z.string().optional()
    })
  }),
  member: z.object({
    user: z.object({
      name: z.string(),
      id: z.string().optional()
    })
  }),
  training: z.object({
    modality: z.string()
  }),
  ...trainingRecordDateCreated
}
const trainingRecordFindUniqueSchema = z.object({
  ...trainingRecordResume
})

const trainingRecordFindManyScheme = z.object({
  ...trainingRecordCount,
  data: z.array(
    z.object({
      ...trainingRecordResume
    })
  )
})

const trainingRecordsQueryStringSchema = z.object({
  id: z.string().optional(),
  training_id: z.string().optional(),
  personal_trainer_id: z.string().optional(),
  member_id: z.string().optional()
})

const createTrainingRecordSchema = z.object({
  ...trainingRecordInput
})

const updateTrainingRecordSchema = z.object({
  status: trainingStatus
})

const TrainingRecordIdSchema = z.object({
  ...trainingRecordId
})

export type CreateTrainingRecordInput = z.infer<typeof createTrainingRecordSchema>
export type DeleteTrainingRecord = z.infer<typeof TrainingRecordIdSchema>
export type GetTrainingRecord = z.infer<typeof TrainingRecordIdSchema>
export type UpdateTrainingRecord = z.infer<typeof updateTrainingRecordSchema>
export type TrainingRecordsQueryString = z.infer<typeof trainingRecordsQueryStringSchema>

export const { schemas: trainingRecordSchemas, $ref } = buildJsonSchemas(
  {
    createTrainingRecordSchema,
    trainingRecordFindManyScheme,
    trainingRecordFindUniqueSchema,
    TrainingRecordIdSchema,
    updateTrainingRecordSchema,
    trainingRecordsQueryStringSchema
  },
  { $id: 'TrainingRecordSchemas' }
)
