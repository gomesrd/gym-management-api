import prisma from '../../../config/prisma'
import { Filters } from '../../../utils/common.schema'
import { planSubscriptionDataInput } from './subscriptions.schema'

export async function createPlansSubscriptions(data: planSubscriptionDataInput) {
  const { plan_id, member_id, starts_at, ends_at } = data

  const memberPlansData = {
    data: member_id.map(memberId => ({
      plan_id: plan_id,
      member_id: memberId,
      starts_at: starts_at,
      ends_at: ends_at
    }))
  }

  return prisma.memberPlan.createMany(memberPlansData)
}
