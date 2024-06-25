import prisma from '../../../config/prisma'
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

export async function getUniquePlanSubscriptionMember(member_plan_id: string) {
  return prisma.memberPlan.findUnique({
    where: {
      id: member_plan_id
    },
    select: {
      id: true,
      plan_id: true,
      plan: {
        select: {
          training_amount: true
        }
      }
    }
  })
}
