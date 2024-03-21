import { daysOfWeek, DaysOfWeek } from '../common.schema'

export async function getDayTraining(date: string | undefined): Promise<DaysOfWeek | undefined> {
  if (!date) return
  const day = new Date(date).getUTCDay()
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const dayOfWeek = days[day]

  return daysOfWeek.parse(dayOfWeek)
}
