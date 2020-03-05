export const getStartEMAEpochTime = (timeTo) => {
  let time = new Date(timeTo * 1000)

  // always set the start utc time as the midnight before
  time.setUTCDate(time.getUTCDate() - 1)
  const midNightEpochTime = time.setUTCHours(0)
  return midNightEpochTime / 1000
}