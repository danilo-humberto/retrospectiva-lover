export type TimeTogether = {
  years: number
  months: number
  days: number
  hours: number
}

function parseLocalDate(date: string) {
  const [year, month, day] = date.split('-').map(Number)

  if (!year || !month || !day) {
    return null
  }

  return new Date(year, month - 1, day)
}

export function calculateTimeTogether(startDate: string, endDate = new Date()): TimeTogether {
  const start = parseLocalDate(startDate)

  if (!start || endDate.getTime() < start.getTime()) {
    return {
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
    }
  }

  let years = endDate.getFullYear() - start.getFullYear()
  let months = endDate.getMonth() - start.getMonth()
  let days = endDate.getDate() - start.getDate()
  let hours = endDate.getHours() - start.getHours()

  if (hours < 0) {
    hours += 24
    days -= 1
  }

  if (days < 0) {
    months -= 1
    days += new Date(endDate.getFullYear(), endDate.getMonth(), 0).getDate()
  }

  if (months < 0) {
    years -= 1
    months += 12
  }

  return {
    years,
    months,
    days,
    hours,
  }
}
