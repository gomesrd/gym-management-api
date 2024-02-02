import prisma from '../../../config/prisma'
import { CreateTrainingReplacement } from '../training.schema'
import { Filters } from '../../../utils/common.schema'
import { FiltersPermissions } from '../../../utils/types'

export async function createTrainingReplacement(input: CreateTrainingReplacement) {
  return prisma.trainingReplacement.create({
    data: input
  })
}

export async function findManyTrainingsReplacement(filters: Filters, parseFilters: FiltersPermissions) {
  const countTrainingReplacement = await prisma.trainingReplacement.count({
    where: {
      realized: parseFilters.realized,
      member_id: filters.member_id
    }
  })
  const trainingReplacement = await prisma.trainingReplacement.findMany({
    where: {
      realized: parseFilters.deleted,
      member_id: filters.member_id
    },
    select: {
      id: true,
      realized: true,
      member: {
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    }
  })

  return {
    count: countTrainingReplacement,
    data: trainingReplacement
  }
}

export async function findUniqueTrainingReplacement(trainingReplacementId: string, parseFilters: FiltersPermissions) {
  return prisma.trainingReplacement.findUnique({
    where: {
      id: trainingReplacementId,
      member_id: parseFilters.member_id,
      realized: parseFilters.realized
    },
    select: {
      id: true,
      realized: true,
      member: {
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          }
        }
      },
      created_at: true,
      updated_at: true
    }
  })
}

export async function updateRealizedTrainingReplacement(trainingReplacementId: string) {
  return prisma.trainingReplacement.update({
    where: {
      id: trainingReplacementId
    },
    data: {
      realized: true
    }
  })
}
