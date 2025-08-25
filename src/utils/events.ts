import { EVENT_END_DATE, EVENT_START_DATE } from "../config";

export const getEventDatesMapping = () => {
  const startDate = new Date(EVENT_START_DATE);
  const endDate = new Date(EVENT_END_DATE);

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
