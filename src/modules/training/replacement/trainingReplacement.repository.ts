import prisma from '../../../config/prisma'
import { CreateTrainingReplacement } from '../training.schema'

import { Filters } from '../../../utils/common.schema'
import { FiltersPermissions } from '../../../utils/types'

export async function createTrainingReplacement(input: CreateTrainingReplacement) {
  const { member_id } = input

  return prisma.trainingReplacement.create({
    data: {
      MemberReplacement: {
        createMany: {
          data: member_id?.map(member => {
            return {
              member_id: member
            }
          })
        }
      }
    },
    include: {
      MemberReplacement: true
    }
  })
}

export async function findManyTrainingsReplacement(filters: Filters, parseFilters: FiltersPermissions) {
  const page = filters?.page || 1
  const pageSize = filters?.pageSize || 10
  const skip = (page - 1) * pageSize

  const countTrainingReplacement = await prisma.trainingReplacement.count({
    where: {
      realized: parseFilters.realized
    }
  })
  const trainingReplacement = await prisma.trainingReplacement.findMany({
    where: {
      realized: parseFilters.deleted
    },
    select: {
      id: true,
      realized: true,
      MemberReplacement: {
        select: {
          Member: {
            select: {
              user: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      },
      created_at: true,
      updated_at: true
    },
    skip: skip,
    take: pageSize
  })

  const trainingReplacementMap = trainingReplacement.map(training => {
    return {
      ...training,
      members: training.MemberReplacement.map(member => member.Member.user.name).join('/')
    }
  })

  return {
    countAll: countTrainingReplacement,
    data: trainingReplacementMap,
    page: page,
    pageSize: pageSize
  }
}

export async function findUniqueTrainingReplacement(trainingReplacementId: string, parseFilters: FiltersPermissions) {
  const findTrainingReplacement = await prisma.trainingReplacement.findUnique({
    where: {
      id: trainingReplacementId,
      realized: parseFilters.realized
    },
    select: {
      id: true,
      MemberReplacement: {
        select: {
          Member: {
            select: {
              user: {
                select: {
                  id: true
                }
              }
            }
          }
        }
      },
      created_at: true,
      updated_at: true
    }
  })

  return {
    ...findTrainingReplacement,
    members: findTrainingReplacement?.MemberReplacement.map(memberTraining => ({
      id: memberTraining.Member.user.id
    }))
  }
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
