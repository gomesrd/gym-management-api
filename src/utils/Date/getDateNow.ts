import { format, formatISO } from 'date-fns'

export function getCurrentDateTime() {
  const now = new Date()

  return format(now, 'yyyy-MM-dd HH:mm:ss.SSS')
}

export function getCurrentDateTimeIso() {
  const now = new Date()

  return formatISO(now, { format: 'extended' })
}
