import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'
import {
  count,
  dateCreatedUpdated,
  daysOfWeek,
  pageableQueryString,
  responseManyDefault,
  trainingModalities,
  trainingStatus,
  trainingTypes
} from '../../utils/common.schema'

const trainingId = {
  id: z.string()
}

const trainingCoreCreate = {
  training: z.object({
    training_date: z.string(),
    starts_at: z.string().nullable(),
    ends_at: z.string().nullable()
  }),
  modality: trainingModalities,
  type: trainingTypes,
  training_replacement_id: z.string().nullable().optional(),
  plan_id: z.string()
}

const trainingCoreList = {
  starts_at: z.string().nullable(),
  ends_at: z.string().nullable(),
  modality: trainingModalities,
  type: trainingTypes,
  training_replacement_id: z.string().nullable().optional(),
  members: z.string(),
  training_date: z.string().nullable(),
}

const trainingInput = {
  ...trainingCoreCreate,
  personal_trainer_id: z.string(),
  member_id: z.string().array().nonempty()
}

const trainingReplacement = {
  member_id: z.string().array().nonempty()
}
const userArraySchema = z
  .array(
    z.object({
      id: z.string().optional()
    })
  )
  .optional()

const userStringSchema = z.string().optional()

const userSchema = z.union([userArraySchema, userStringSchema])

const trainingReplacementResponse = {
  id: z.string().optional(),
  status: trainingStatus.optional(),
  members: userSchema,
  ...dateCreatedUpdated
}

const usersResume = {
  personal_trainer: z
    .object({
      name: z.string().optional(),
      id: z.string().optional()
    })
    .optional(),
  members: z
    .array(
      z
        .object({
          member_id: z.string().optional(),
          name: z.string().optional(),
          id: z.string().optional()
        })
        .optional()
    )
    .optional()
}

const trainingResume = {
  ...trainingId,
  ...trainingCoreList
}

const trainingFindUniqueSchema = z.object({
  ...trainingResume,
  ...usersResume,
  ...dateCreatedUpdated
})

const trainingReplacementFindUniqueSchema = z.object({
  ...trainingReplacementResponse
})

export const trainingIdSchema = {
  type: 'object',
  properties: {
    training_id: { type: 'string', description: 'Training Id' }
  }
}

export const trainingReplacementIdSchema = {
  type: 'object',
  properties: {
    training_replacement_id: { type: 'string', description: 'Training Replacement Id' }
  }
}

export const queryStringTrainingReplacement = {
  type: 'object',
  properties: {
    member_id: { type: 'string' },
    status: { type: 'string' },
    ...pageableQueryString
  },
  required: ['page', 'pageSize']
}

const trainingFindManyScheme = z.object({
  ...responseManyDefault,
  data: z.array(
    z.object({
      ...trainingResume,
      personal_trainer: z.string(),
      deleted: z.boolean()
    })
  )
})

const trainingReplacementFindManyScheme = z.object({
  ...responseManyDefault,
  data: z.array(
    z.object({
      ...trainingReplacementResponse
    })
  )
})

const trainingUpdateSchema = z.object({
  ...trainingCoreCreate,
  personal_trainer_id: z.string().optional(),
  active: z.boolean().optional()
})

const trainingCreateSchema = z.object({
  ...trainingInput
})

const trainingReplacementCreateSchema = z.object({ ...trainingReplacement })

export type CreateTrainingInput = z.infer<typeof trainingCreateSchema>
export type CreateTrainingReplacement = z.infer<typeof trainingReplacementCreateSchema>
export type UpdateTraining = z.infer<typeof trainingUpdateSchema>
export type FindManyTraining = z.infer<typeof trainingFindManyScheme>

export const { schemas: trainingSchemas, $ref } = buildJsonSchemas(
  {
    trainingCreateSchema,
    trainingReplacementCreateSchema,
    trainingFindManyScheme,
    trainingFindUniqueSchema,
    trainingUpdateSchema,
    trainingReplacementFindManyScheme,
    trainingReplacementFindUniqueSchema
  },
  { $id: 'TrainingSchemas' }
)
