import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'
import { count, dateCreatedUpdated, daysOfWeek, trainingModalities, trainingTypes } from '../../utils/common.schema'

const trainingId = {
  id: z.string()
}

const trainingCore = {
  fixed_day: daysOfWeek.nullable(),
  single_date: z.string().nullable(),
  start_time: z.string().nullable(),
  end_time: z.string().nullable(),
  modality: trainingModalities,
  type: trainingTypes,
  training_replacement_id: z.string().nullable().optional()
}

const trainingInput = {
  ...trainingCore,
  personal_trainer_id: z.string(),
  member_id: z.string()
}

const trainingReplacement = {
  id: z.string().optional(),
  member_id: z.string(),
  realized: z.boolean()
}

const trainingReplacementResponse = {
  id: z.string().optional(),
  realized: z.boolean(),
  member: z.object({
    user: z.object({
      id: z.string(),
      name: z.string()
    })
  })
}

const usersResume = {
  personal_trainer: z
    .object({
      user: z
        .object({
          name: z.string().optional(),
          id: z.string().optional()
        })
        .optional()
    })
    .optional(),
  member: z
    .object({
      user: z
        .object({
          name: z.string().optional(),
          id: z.string().optional()
        })
        .optional()
    })
    .optional()
}

const trainingResume = {
  ...trainingId,
  ...trainingCore,
  ...usersResume
}

const trainingFindUniqueSchema = z.object({
  ...trainingResume,
  ...dateCreatedUpdated
})

const trainingReplacementFindUniqueSchema = z.object({
  ...trainingReplacementResponse,
  ...dateCreatedUpdated
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
    realized: { type: 'string' }
  }
}

const trainingFindManyScheme = z.object({
  ...count,
  data: z.array(
    z.object({
      ...trainingResume
    })
  )
})

const trainingReplacementFindManyScheme = z.object({
  ...count,
  data: z.array(
    z.object({
      ...trainingReplacementResponse
    })
  )
})

const trainingUpdateSchema = z.object({
  ...trainingCore,
  personal_trainer_id: z.string().optional(),
  active: z.boolean().optional()
})

const trainingCreateSchema = z.array(
  z.object({
    ...trainingInput
  })
)

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
