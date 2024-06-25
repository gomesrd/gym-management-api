import { addHours, format, formatISO, parseISO } from 'date-fns'

export function getCurrentDateTime() {
  const now = new Date()

  return format(now, 'yyyy-MM-dd HH:mm:ss.SSS')
}

export function getCurrentDateTimeIso() {
  const now = new Date()

  return formatISO(now, { format: 'extended' })
}

export function getDateWithThreeHours(date: string) {
  const dateIso = parseISO(date)

  const newDate = addHours(dateIso, 3)

  return format(newDate, 'yyyy-MM-dd HH:mm:ss')
}
