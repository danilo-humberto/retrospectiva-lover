export function formatTime(valueInSeconds: number) {
  if (!Number.isFinite(valueInSeconds) || valueInSeconds < 0) {
    return '0:00'
  }

  const totalSeconds = Math.floor(valueInSeconds)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
