import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'
import { responseManyDefault, trainingStatus, trainingTypes } from '../../utils/common.schema'

const trainingRecordId = {
  id: z.string()
}

const trainingRecordDateCreated = {
  created_at: z.date(),
  updated_at: z.date()
}

const trainingRecordInput = {
  status: trainingStatus,
  training_id: z.string(),
  type: trainingTypes,
  replacement: z.boolean().nullable().optional(),
  training_replacement_id: z.string().optional()
}

const userArraySchema = z
  .array(
    z.object({
      id: z.string().optional(),
      name: z.string().optional()
    })
  )
  .optional()

const UserObjectSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().optional()
  })
  .optional()

const userStringSchema = z.string().optional()

const userSchema = z.union([userArraySchema, UserObjectSchema, userStringSchema])

const trainingRecordResume = {
  ...trainingRecordId,
  ...trainingRecordInput,
  modality: z.string(),
  type: z.string(),
  personal_trainer: userSchema,
  members: userSchema,
  ...trainingRecordDateCreated
}

const trainingRecordFindUniqueSchema = z.object({
  ...trainingRecordResume
})

const trainingRecordFindManyScheme = z.object({
  ...responseManyDefault,
  data: z.array(
    z.object({
      ...trainingRecordResume
    })
  )
})

const trainingRecordStatusFindManyScheme = z.array(
  z.object({
    training_id: z.string(),
    status: trainingStatus
  })
)

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
    trainingRecordsQueryStringSchema,
    trainingRecordStatusFindManyScheme
  },
  { $id: 'TrainingRecordSchemas' }
)
