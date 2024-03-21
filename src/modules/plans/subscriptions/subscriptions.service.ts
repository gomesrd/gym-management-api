import { FastifyReply, FastifyRequest } from 'fastify'
import { planSubscriptionBodyInput } from './subscriptions.schema'
import { getUniquePlan } from '../plans/plans.repository'
import { getDatesForMemberPlans } from '../../../utils/Date/getFutereDate'
import { createPlansSubscriptions } from './subscriptions.repository'

export async function registerPlanSubscriptionHandler(
  request: FastifyRequest<{
    Body: planSubscriptionBodyInput
  }>,
  reply: FastifyReply
) {
  const { plan_id, member_id } = request.body

  const planSelected = await getUniquePlan(plan_id)

  if (!planSelected) {
    return reply.code(404).send('Plan not found')
  }

  const { recurrence } = planSelected

  const { starts_at, ends_at } = getDatesForMemberPlans(recurrence)

  const data = {
    plan_id,
    member_id,
    starts_at,
    ends_at
  }

  try {
    await createPlansSubscriptions(data)

    return reply.code(201).send('')
  } catch (error: any) {
    console.log(error)

    return reply.code(500).send('Internal server error')
  }
}
