import { addMonths, addQuarters, addYears } from 'date-fns'
import { recurrenceTrainingPlan } from './common.schema'
import { z } from 'zod'

export interface FutureDate {
  starts_at: Date
  ends_at: Date
}

export enum RecurrenceTrainingPlan {
  monthly = 'monthly',
  quarterly = 'quarterly',
  semiannual = 'semiannual',
  annual = 'annual'
}

export function getDatesForMemberPlans(recurrence: z.infer<typeof recurrenceTrainingPlan>): FutureDate {
  const today = new Date()
  let futureDate: Date

  switch (recurrence) {
    case RecurrenceTrainingPlan.monthly:
      futureDate = addMonths(today, 1)
      break
    case RecurrenceTrainingPlan.quarterly:
      futureDate = addQuarters(today, 1)
      break
    case RecurrenceTrainingPlan.semiannual:
      futureDate = addMonths(today, 6)
      break
    case RecurrenceTrainingPlan.annual:
      futureDate = addYears(today, 1)
      break
    default:
      throw new Error('Invalid recurrence type')
  }

  return {
    starts_at: today,
    ends_at: futureDate
  }
}
