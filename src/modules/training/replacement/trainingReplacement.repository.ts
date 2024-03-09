import prisma from '../../../config/prisma'
import { CreateTrainingReplacement } from '../training.schema'

import { Filters } from '../../../utils/common.schema'
import { FiltersPermissions } from '../../../utils/types'
import { UpdateTrainingRecord } from '../../trainingRecord/trainingRecord.schema'

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
  const { member_id, status } = filters

  const countTrainingReplacement = await prisma.trainingReplacement.count({
    where: {
      status: status || undefined,
      MemberReplacement: {
        some: {
          Member: {
            user: {
              id: member_id || undefined
            }
          }
        }
      }
    }
  })
  const trainingReplacement = await prisma.trainingReplacement.findMany({
    where: {
      status: status || undefined,

      MemberReplacement: {
        some: {
          Member: {
            user: {
              id: member_id || undefined
            }
          }
        }
      }
    },
    select: {
      id: true,
      status: true,
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
    take: pageSize,
    orderBy: [{ created_at: 'asc' }, { status: 'asc' }]
  })

  const trainingReplacementMap = trainingReplacement.map(training => {
    return {
      ...training,
      members: training.MemberReplacement.map(member => member.Member.user.name).join('/')
    }
  })

  return {
    totalCount: countTrainingReplacement,
    data: trainingReplacementMap,
    page: page,
    pageSize: pageSize
  }
}

export async function findUniqueTrainingReplacement(trainingReplacementId: string, parseFilters: FiltersPermissions) {
  const findTrainingReplacement = await prisma.trainingReplacement.findUnique({
    where: {
      id: trainingReplacementId
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

export async function updateRealizedTrainingReplacement(trainingReplacementId: string, status: UpdateTrainingRecord) {
  console.log(status.status)

  return prisma.trainingReplacement.update({
    where: {
      id: trainingReplacementId
    },
    data: {
      status: status.status
    }
  })
}
