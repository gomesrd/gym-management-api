import { object, z } from 'zod'
import {
  dateCreatedUpdated,
  memberAmountTraining,
  recurrenceTrainingPlan,
  responseManyDefault,
  trainingModalities
} from '../../utils/common.schema'
import { buildJsonSchemas } from 'fastify-zod'

const planId = {
  id: z.string()
}

const planDataInput = {
  name: z.string(),
  description: z.string().optional(),
  modality: trainingModalities,
  recurrence: recurrenceTrainingPlan,
  member_amount: memberAmountTraining,
  training_amount: z.number(),
  price: z.number()
}

const PlanRegisterSchema = z.object({
  ...planDataInput
})

const planGetByIdSchema = z.object({
  ...planId,
  ...planDataInput,
  ...dateCreatedUpdated
})

const plansGetManySchema = z.object({
  ...responseManyDefault,
  data: z.array(
    z.object({
      ...planId,
      ...planDataInput
    })
  )
})

export const { schemas: plansSchemas, $ref } = buildJsonSchemas(
  {
    PlanRegisterSchema,
    planGetByIdSchema,
    plansGetManySchema
  },
  { $id: 'PlansSchemas' }
)

export type PlanRegisterInput = z.infer<typeof PlanRegisterSchema>
