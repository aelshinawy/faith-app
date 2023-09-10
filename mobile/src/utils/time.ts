import {assert} from "./assert";
import {TimeFormat, TimeSuffix, timeSuffixes} from "./PrayerTimeCalculator"; // ----- UNIT CONVERSIONS -----

// ----- UNIT CONVERSIONS -----
export const minsToMs = (n: number) => {
  return n * 60000;
};

export const daysToMs = (n: number) => {
  return n * 86400000;
};

// ----- PERFECT UNITS -----
export const toPerfectMin = (date?: Date) => {
  if (date === undefined) date = new Date();
  date.setHours(date.getHours(), date.getMinutes(), 0, 0);
  return date;
};

export const nextPerfectMin = (date?: Date) => {
  if (date === undefined) date = new Date();
  date.setHours(date.getHours(), date.getMinutes() + 1, 0, 0);
  return date;
};

// ----- FORMAT UTILS -----
export const formattedTimeToDate = (
  formattedTime: string,
  day?: Date | [number, number, number]
) => {
  const suffix = formattedTime.slice(-2);
  if (suffix === "pm" || suffix === "am") {
    formattedTime = formattedTime.trim().slice(0, -2);
  }

  if (day === undefined) {
    day = new Date();
  } else if (day instanceof Array) {
    day = new Date(...day);
  }

  const date = new Date();
  const time = formattedTime?.split(":").map((val) => {
    return parseInt(val);
  }) as [number, number];

  console.log("unformatted time is:", time);

  time[0] = timeSuffixes.includes(suffix as TimeSuffix)
    ? time[0] % 12
    : time[0];
  if (time[0] === 0 && suffix === "am") {
    time[0] = 24;
  }
  time[0] += +(suffix === "pm") * 12;
  if (time !== undefined) {
    date.setHours(...time, 0, 0);
  }
  return date;
};

export const twoDigitNum = (n: number) => {
  if (n < 10) return `0${n}`;
  return n;
};

export const getDefaultFormat = (): TimeFormat => {
  const suffix = new Date().toLocaleTimeString().slice(-2);

  if (suffix === "am" || suffix === "pm") {
    return "12h";
  }

  return "24h";
};

export const hrMinFormat = (date: Date, format?: TimeFormat) => {
  if (format === undefined) {
    format = getDefaultFormat();
  }

  let suffix: string;

  switch (format) {
    case "12h":
      suffix = date.getHours() < 12 ? "am" : "pm";
      return `${twoDigitNum(date.getHours() % 12)}:${twoDigitNum(
        date.getMinutes()
      )} ${suffix}`;
    case "12hNS":
      return `${twoDigitNum(date.getHours() % 12)}:${twoDigitNum(
        date.getMinutes()
      )}`;
    case "24h":
      return `${twoDigitNum(date.getHours())}:${twoDigitNum(
        date.getMinutes()
      )}`;
    case "Float":
      return `${date.getHours() + date.getMinutes() / 60}`;
    default:
      throw "lolololol, everything broke. idiot";
  }
};

// ----- OTHER UTILS -----
export const nextDay = (date: Date = new Date()) => {
  return new Date(date.valueOf() + daysToMs(1));
};

export const prevDay = (date: Date = new Date()) => {
  return new Date(date.valueOf() - daysToMs(1));
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
