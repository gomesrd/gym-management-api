import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'

const planId = {
  id: z.string()
}

const planSubscriptionDataInput = {
  plan_id: z.string(),
  member_id: z.array(z.string())
}

const planSubscriptionDate = {
  starts_at: z.date(),
  ends_at: z.date()
}

const planSubscriptionDataSchema = z.object({
  ...planSubscriptionDataInput,
  ...planSubscriptionDate
})

const planSubscriptionBodySchema = z.object({
  ...planSubscriptionDataInput
})

export const { schemas: subscriptionsSchemas, $ref } = buildJsonSchemas(
  {
    planSubscriptionDataSchema,
    planSubscriptionBodySchema
  },
  { $id: 'SubscriptionSchemas' }
)

export type planSubscriptionBodyInput = z.infer<typeof planSubscriptionBodySchema>
export type planSubscriptionDataInput = z.infer<typeof planSubscriptionDataSchema>
