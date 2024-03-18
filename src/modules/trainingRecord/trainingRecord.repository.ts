import prisma from '../../config/prisma'
import { CreateTrainingRecordInput, UpdateTrainingRecord } from './trainingRecord.schema'
import { Filters } from '../../utils/common.schema'
import { FiltersPermissions } from '../../utils/types'

export async function createTrainingRecord(input: CreateTrainingRecordInput) {
  const { training_id, status } = input

  return prisma.trainingRecord.create({
    data: {
      training_id,
      status
    }
  })
}

export async function findManyTrainingRecords(filters: Filters, parseFilters: FiltersPermissions) {
  const page = filters?.page || 1
  const pageSize = filters?.pageSize || 10
  const skip = (page - 1) * pageSize

  const trainingRecordsCount = await prisma.trainingRecord.count({
    where: {
      training_id: filters.training_id,
      status: filters.status,
      created_at: {
        gte: filters.created_at_gte,
        lte: filters.created_at_lte
      }
    }
  })

  const trainingRecords = await prisma.trainingRecord.findMany({
    where: {
      training_id: filters.training_id,
      status: filters.status,
      created_at: {
        gte: filters.created_at_gte,
        lte: filters.created_at_lte
      }
    },
    select: {
      id: true,
      status: true,
      training_id: true,
      training: {
        select: {
          modality: true,
          type: true,
          personal_trainer: {
            select: {
              user: {
                select: {
                  id: false,
                  name: true
                }
              }
            }
          },
          MemberTraining: {
            select: {
              member_id: true,
              Member: {
                select: {
                  user: {
                    select: {
                      id: false,
                      name: true
                    }
                  }
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

  const formatedTrainingRecords = trainingRecords.map(trainingRecord => {
    return {
      ...trainingRecord,
      modality: trainingRecord.training.modality,
      type: trainingRecord.training.type,
      personal_trainer: trainingRecord.training.personal_trainer.user.name,
      members: trainingRecord.training.MemberTraining.map(memberTraining => memberTraining.Member.user.name).join('/')
    }
  })

  return {
    totalCount: trainingRecordsCount,
    data: formatedTrainingRecords,
    page: page,
    pageSize: pageSize
  }
}

export async function findManyTrainingRecordsStatus(filters: Filters) {
  return prisma.trainingRecord.findMany({
    where: {
      created_at: {
        gte: filters.created_at_gte,
        lte: filters.created_at_lte
      }
    },
    select: {
      status: true,
      training_id: true
    }
  })
}

export async function findUniqueTrainingRecord(trainingRecordId: string, parseFilters: FiltersPermissions) {
  const trainingRecord = await prisma.trainingRecord.findUnique({
    where: {
      id: trainingRecordId
    },
    select: {
      id: true,
      status: true,
      training_id: true,
      training: {
        select: {
          modality: true,
          type: true,
          personal_trainer: {
            select: {
              user: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          },
          MemberTraining: {
            select: {
              member_id: true,
              Member: {
                select: {
                  user: {
                    select: {
                      id: true,
                      name: true
                    }
                  }
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
    ...trainingRecord,
    modality: trainingRecord?.training.modality,
    type: trainingRecord?.training.type,
    personal_trainer: {
      id: trainingRecord?.training.personal_trainer.user.id,
      name: trainingRecord?.training.personal_trainer.user.name
    },
    members: trainingRecord?.training.MemberTraining.map(member => {
      return {
        id: member.member_id,
        name: member.Member.user.name
      }
    })
  }
}

export async function updateTrainingRecord(trainingId: string, dataUpdate: UpdateTrainingRecord) {
  return prisma.trainingRecord.update({
    where: {
      id: trainingId
    },
    data: {
      status: dataUpdate.status
    }
  })
}

export async function deleteTrainingRecord(trainingRecordId: string) {
  return prisma.trainingRecord.delete({
    where: {
      id: trainingRecordId
    }
  })
}
