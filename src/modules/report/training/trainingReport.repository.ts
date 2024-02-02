import { Filters } from '../../../utils/common.schema'
import prisma from '../../../config/prisma'
import { Status, TrainingType } from '@prisma/client'

export async function getManyReportTrainingRepository(filters: Filters, memberId: string) {
  const totalRegularTrainingsRealized = await prisma.trainingRecord.count({
    where: {
      created_at: {
        gte: filters.created_at_gte,
        lte: filters.created_at_lte
      },
      member_id: memberId,
      status: Status.realized,
      type: TrainingType.plan || TrainingType.singular
    }
  })

  const totalTrainingsFoul = await prisma.trainingRecord.count({
    where: {
      created_at: {
        gte: filters.created_at_gte,
        lte: filters.created_at_lte
      },
      member_id: memberId,
      status: Status.foul
    }
  })

  const totalTrainingsReplacement = await prisma.trainingRecord.count({
    where: {
      created_at: {
        gte: filters.created_at_gte,
        lte: filters.created_at_lte
      },
      member_id: memberId,
      status: Status.realized,
      type: TrainingType.replacement
    }
  })

  const totalTrainingsPendingReplacement = await prisma.trainingReplacement.count({
    where: {
      member_id: memberId,
      realized: false
    }
  })

  const totalTrainings = totalRegularTrainingsRealized + totalTrainingsFoul + totalTrainingsReplacement

  const memberData = await prisma.users.findUnique({
    where: {
      id: memberId
    },
    select: {
      id: true,
      name: true
    }
  })

  return {
    member: memberData,
    totalRegularTrainingsRealized: totalRegularTrainingsRealized,
    totalTrainingsFoul: totalTrainingsFoul,
    totalTrainingsReplacement: totalTrainingsReplacement,
    totalTraining: totalTrainings,
    totalTrainingsPendingReplacement: totalTrainingsPendingReplacement
  }
}
