import prisma from '../../config/prisma'
import { PlanRegisterInput } from './plans.schema'
import { Filters } from '../../utils/common.schema'

export async function createPlan(input: PlanRegisterInput) {
  const { name, description, modality, recurrence, member_amount, training_amount, price } = input

  return prisma.plan.create({
    data: {
      name: name,
      description: description,
      modality: modality,
      recurrence: recurrence,
      member_amount: member_amount,
      training_amount: training_amount,
      price: price
    }
  })
}

export async function getUniquePlan(planId: string) {
  return prisma.plan.findUnique({
    where: {
      id: planId
    },
    select: {
      id: true,
      name: true,
      description: true,
      modality: true,
      recurrence: true,
      member_amount: true,
      training_amount: true,
      price: true,
      created_at: true,
      updated_at: true
    }
  })
}

export async function getManyPlans(filters: Filters) {
  const page = filters?.page || 1
  const pageSize = filters?.pageSize || 10
  const skip = (page - 1) * pageSize

  const countPlans = await prisma.plan.count()

  const plans = await prisma.plan.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      modality: true,
      recurrence: true,
      member_amount: true,
      training_amount: true,
      price: true,
      created_at: false,
      updated_at: false
    },
    skip: skip,
    take: pageSize,
    orderBy: [{ created_at: 'asc' }, { name: 'asc' }]
  })

  return {
    totalCount: countPlans,
    data: plans,
    page: page,
    pageSize: pageSize
  }
}

export async function updatePlans(planId: string, dataUpdate: PlanRegisterInput) {
  return prisma.plan.update({
    where: {
      id: planId
    },
    data: dataUpdate
  })
}

export async function deletePlans(planId: string) {
  return prisma.plan.update({
    where: {
      id: planId
    },
    data: {
      deleted: true
    }
  })
}
