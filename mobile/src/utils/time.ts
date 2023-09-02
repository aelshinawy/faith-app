import { assert } from "./assert";

export const formattedTimeToDate = (formattedTime: string) => {
  const suffix = formattedTime.slice(-2);
  if (suffix === "pm" || suffix === "am") {
    formattedTime = formattedTime.trim().slice(0, -2);
  }

  const date = new Date();
  const time = formattedTime?.split(":").map((val) => {
    return parseInt(val);
  }) as [number, number];
  console.log("we got time:", time);

  time[0] = time[0] % 12;
  if (time[0] === 0 && suffix === "am") {
    time[0] = 24;
  }
  time[0] += +(suffix === "pm") * 12;
  if (time !== undefined) {
    date.setHours(...time, 0, 0);
  }
  return date;
};

export const todayAtTime = (time: [number, number]) => {
  const now = new Date();
  now.setHours(time[0], time[1], 0, 0);
  return now;
};

/**
 * @returns {-1 | 0 | 1},  -1 if date is before range, 0 if date is in range,
 * 1 if
 * date is after range
 */
export const compareDateToRange = (
  date: Date,
  range: [Date, Date]
): -1 | 0 | 1 => {
  assert(
    range[0].getTime() < range[1].getTime(),
    `${range[0].toString()} is not an earlier date than ${range[1].toString()}`
  );
  if (date.getTime() < range[0].getTime()) return -1;
  if (date.getTime() >= range[1].getTime()) return 1;
  return 0;
};