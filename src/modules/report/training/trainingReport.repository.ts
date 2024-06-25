import { Filters } from '../../../utils/common.schema'
import prisma from '../../../config/prisma'
import { Status, TrainingType } from '@prisma/client'
import { getDateWithThreeHours } from '../../../utils/Date/getDateNow'

export async function getManyReportTrainingRepository(filters: Filters, memberId: string) {
  if (filters.created_at_lte) console.log(getDateWithThreeHours(filters.created_at_lte))

  const totalRegularTrainingsRealized = await prisma.trainingRecord.count({
    where: {
      created_at: {
        gte: filters.created_at_gte,
        lte: filters.created_at_lte
      },
      status: Status.realized
    }
  })

  const totalTrainingsFoul = await prisma.trainingRecord.count({
    where: {
      created_at: {
        gte: filters.created_at_gte,
        lte: filters.created_at_lte
      },
      status: Status.foul
    }
  })

  const totalTrainingsReplacement = await prisma.trainingReplacement.count({
    where: {
      created_at: {
        gte: filters.created_at_gte,
        lte: filters.created_at_lte
      },
      status: 'realized',
      MemberReplacement: {
        some: {
          member_id: memberId
        }
      }
    }
  })

  const totalTrainingsPendingReplacement = await prisma.trainingReplacement.count({
    where: {
      MemberReplacement: {
        some: {
          member_id: memberId
        }
      },
      status: {
        in: ['scheduled', 'pending']
      }
    }
  })

  const totalTrainings = totalRegularTrainingsRealized + totalTrainingsFoul - totalTrainingsReplacement

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
    totalTrainingsReplacement: totalTrainingsReplacement,
    totalTrainingsFoul: totalTrainingsFoul,
    totalTraining: totalTrainings,
    totalTrainingsPendingReplacement: totalTrainingsPendingReplacement
  }
}
