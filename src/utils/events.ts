export const getSlotsInterval = (
  slots: Array<{ start: string; end: string }>
): [Date, Date] => {
  const startTimes = slots.map((s) => new Date(s.start).getTime());
  const endTimes = slots.map((s) => new Date(s.end).getTime());

  const oldestStartTime = Math.min(...startTimes);
  const latestEndTime = Math.max(...endTimes);

  const startDate = new Date(oldestStartTime);
  const endDate = new Date(latestEndTime);

  return [startDate, endDate];
};

export const getEventDatesMapping = (startDate: Date, endDate: Date) => {
  const daysMap = new Map<string, string>();
  const currentDate = new Date(startDate);
  let dayCount = 1;

  while (currentDate <= endDate) {
    const dayLabel = `Day ${dayCount}`;
    daysMap.set(dayLabel, currentDate.toDateString());
    currentDate.setDate(currentDate.getDate() + 1);
    dayCount++;
  }

  return daysMap;
};
