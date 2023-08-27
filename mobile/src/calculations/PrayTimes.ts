//--------------------- Copyright Block ----------------------
/*

PrayTimes.js: Prayer Times Calculator (ver 2.3)
Copyright (C) 2007-2011 PrayTimes.org

Developer: Hamid Zarrabi-Zadeh
License: GNU LGPL v3.0

TERMS OF USE:
	Permission is granted to use this code, with or
	without modification, in any website or application
	provided that credit is given to the original work
	with a link back to PrayTimes.org.

This program is distributed in the hope that it will
be useful, but WITHOUT ANY WARRANTY.

PLEASE DO NOT REMOVE THIS COPYRIGHT BLOCK.

*/

/*
 * Translated to TypeScript by: Ali Haitham Youssef Mahmoud
 * NOTE:
 *   This program is functionally identical to the PrayTimes.js
 *   program available on http://praytimes.org. It has just been
 *   implemented in TypeScript, introducing typing. */

//--------------------- Help and Manual ----------------------
/*

User's Manual:
http://praytimes.org/manual

Calculation Formulas:
http://praytimes.org/calculation



//------------------------ User Interface -------------------------


	getTimes (date, coordinates [, timeZone [, dst [, timeFormat]]])

	setMethod (method)       // set calculation method
	adjust (parameters)      // adjust calculation parameters
	tune (offsets)           // tune times by given offsets

	getMethod ()             // get calculation method
	getSetting ()            // get current calculation parameters
	getOffsets ()            // get current time offsets


//------------------------- Sample Usage --------------------------


	var PT = new PrayTimes('ISNA');
	var times = PT.getTimes(new Date(), [43, -80], -5);
	document.write('Sunrise = '+ times.sunrise)


*/

//---------------------- Degree-Based Math Class -----------------------

import { assert, assertDefined } from "../utils/assert";

const DMath = {
  dtr: function (d: number) {
    return (d * Math.PI) / 180.0;
  },
  rtd: function (r: number) {
    return (r * 180.0) / Math.PI;
  },

  sin: function (d: number) {
    return Math.sin(this.dtr(d));
  },
  cos: function (d: number) {
    return Math.cos(this.dtr(d));
  },
  tan: function (d: number) {
    return Math.tan(this.dtr(d));
  },

  arcsin: function (d: number) {
    return this.rtd(Math.asin(d));
  },
  arccos: function (d: number) {
    return this.rtd(Math.acos(d));
  },
  arctan: function (d: number) {
    return this.rtd(Math.atan(d));
  },

  arccot: function (x: number) {
    return this.rtd(Math.atan(1 / x));
  },
  arctan2: function (y: number, x: number) {
    return this.rtd(Math.atan2(y, x));
  },

  fixAngle: function (a: number) {
    return this.fix(a, 360);
  },
  fixHour: function (a: number) {
    return this.fix(a, 24);
  },

  fix: function (a: number, b: number) {
    a = a - b * Math.floor(a / b);
    return a < 0 ? a + b : a;
  },
};

// -------- Constants --------
const timeNames = {
  imsak: "Imsak",
  fajr: "Fajr",
  sunrise: "Sunrise",
  dhuhr: "Dhuhr",
  asr: "Asr",
  sunset: "Sunset",
  maghrib: "Maghrib",
  isha: "Isha",
  midnight: "Midnight",
} as const;

const methods = {
  MWL: {
    name: "Muslim World League",
    params: { fajr: 18, isha: 17 },
  },
  ISNA: {
    name: "Islamic Society of North America (ISNA)",
    params: { fajr: 15, isha: 15 },
  },
  Egypt: {
    name: "Egyptian General Authority of Survey",
    params: { fajr: 19.5, isha: 17.5 },
  },
  Makkah: {
    name: "Umm Al-Qura University, Makkah",
    params: { fajr: 18.5, isha: "90 min" },
  }, // fajr was 19 degrees before 1430 hijri
  Karachi: {
    name: "University of Islamic Sciences, Karachi",
    params: { fajr: 18, isha: 18 },
  },
  Tehran: {
    name: "Institute of Geophysics, University of Tehran",
    params: { fajr: 17.7, isha: 14, maghrib: 4.5, midnight: "Jafari" },
  }, // isha is not explicitly specified in this method
  Jafari: {
    name: "Shia Ithna-Ashari, Leva Institute, Qum",
    params: { fajr: 16, isha: 14, maghrib: 4, midnight: "Jafari" },
  },
} as const;

const asrJuristics = [
  "Standard", // Shafi`i, Maliki, Ja`fari, Hanbali
  "Hanafi", // Hanafi
] as const;

const highLatMethods = [
  "NightMiddle", // middle of night
  "AngleBased", // angle/60th of night
  "OneSeventh", // 1/7th of night
  "None", // No adjustment
] as const;

const timeFormats = [
  "24h", // 24-hour format
  "12h", // 12-hour format
  "12hNS", // 12-hour format with no suffix
  "Float", // floating point number
] as const;

const timeSuffixes = ["am", "pm"] as const;

// -------- Types --------
type TimeName = keyof typeof timeNames;
type Method = keyof typeof methods;
type Params = Partial<Record<TimeName, number | string>>;
type Settings = Params & {
  highLats?: (typeof highLatMethods)[number];
  timeFormat?: (typeof timeFormats)[number];
};
type TimeFormat = (typeof timeFormats)[number];
type TimeOffsets = Partial<Record<TimeName, number>>;
type RotationDirection = "ccw" | "cw";

// -------- Default Values --------
const defaultParams: Params = {
  maghrib: "0 min",
  midnight: "Standard",
} as const;

const defaultSettings: Settings = {
  imsak: "10 min",
  dhuhr: "0 min",
  asr: "Standard",
  highLats: "NightMiddle",
  timeFormat: "24h",
} as const;

const defaultTimeFormat: TimeFormat = "24h";
const numIterations = 1;
const invalidTime = "-----";

class PrayTimes {
  private calcMethod: Method;
  private lat?: number;
  private lng?: number;
  private elv?: number;
  private timeZone?: number;
  private jDate?: number;
  private params: Params;
  private offset: TimeOffsets = {};

  private settings: Settings = {
    ...defaultSettings,
  };

  private timeFormat = defaultTimeFormat;

  constructor(method: Method) {
    this.calcMethod = method;
    this.params = { ...methods[this.calcMethod].params };

    // complete params
    let defParam: keyof Params;
    for (defParam in defaultParams) {
      if (this.params[defParam] === undefined) {
        this.params[defParam] = defaultParams[defParam];
      }
    }

    // init settings
    let param: keyof Params;
    for (param in this.params) {
      this.settings[param] = this.params[param];
    }
  }

  // ---- Setters ----
  public setMethod(method: Method) {
    this.adjust(methods[method].params);
    this.calcMethod = method;
  }

  public adjust(settings: Partial<Settings>) {
    //Reset Params to default
    this.settings = {
      ...defaultParams,
      ...defaultSettings,
    };

    //fill in method params
    let id: keyof Settings;
    for (id in settings) {
      this.settings[id] = settings[id] as any;
    }
  }

  public tune(timeOffsets: TimeOffsets) {
    let time: TimeName;
    for (time in timeOffsets) {
      this.offset[time] = timeOffsets[time];
    }
  }

  // ---- Getters ----
  public getMethod() {
    return this.calcMethod;
  }

  public getSettings() {
    return this.settings;
  }

  public getOffsets() {
    return this.offset;
  }

  public getTimes(
    date: Date | number[],
    coords: number[],
    timezone?: number | "auto",
    dst?: number | "auto",
    format?: TimeFormat
  ) {
    this.lat = coords[0];
    this.lng = coords[1];
    this.elv = coords[2] ? coords[2] : 0;
    this.timeFormat = format || this.timeFormat;
    console.log("format: ", this.timeFormat);

    if (date instanceof Date)
      date = [date.getFullYear(), date.getMonth() + 1, date.getDate()];

    if (timezone === undefined || timezone == "auto")
      timezone = this.getTimeZone(date);

    if (dst === undefined || dst === "auto") dst = this.getDst(date);

    this.timeZone = timezone + (dst !== 0 ? 1 : 0);
    this.jDate = this.julian(date) - this.lng / (15 * 24);

    return this.computeTimes();
  }

  // ---- Timezone functions ----
  private getTimeZone(date: Array<number>) {
    const year = date[0];
    const t1 = this.gmtOffset([year, 0, 1]);
    const t2 = this.gmtOffset([year, 6, 1]);
    return Math.min(t1, t2);
  }

  private gmtOffset(date: Array<number>) {
    const localDate = new Date(date[0], date[1] - 1, date[2], 12, 0, 0, 0);
    const timeString = localDate.toTimeString();
    const GMTDiff = timeString.split(" ")[1];
    const hoursDiff = Number.parseInt(GMTDiff.slice(3, GMTDiff.length)) / 100;
    return hoursDiff;
  }

  // Get Daylight Saving Time
  private getDst(date: Array<number>) {
    return +(this.gmtOffset(date) !== this.getTimeZone(date));
  }

  // ---- Calculation Functions ----
  private midDay(time: number) {
    assert(this.jDate !== undefined);
    const eqt = this.sunPosition(this.jDate + time).equation;
    const noon = DMath.fixHour(12 - eqt);
    return noon;
  }

  // compute declination angle of sun and equation of time
  // Ref: http://aa.usno.navy.mil/faq/docs/SunApprox.php
  private sunPosition(jd: number) {
    const D = jd - 2451545.0;
    const g = DMath.fixAngle(357.529 + 0.98560028 * D);
    const q = DMath.fixAngle(280.459 + 0.98564736 * D);
    const L = DMath.fixAngle(
      q + 1.915 * DMath.sin(g) + 0.02 * DMath.sin(2 * g)
    );

    // const R = 1.00014 - 0.01671 * DMath.cos(g) - 0.00014 * DMath.cos(2 * g);
    const e = 23.439 - 0.00000036 * D;

    const RA = DMath.arctan2(DMath.cos(e) * DMath.sin(L), DMath.cos(L)) / 15;
    const eqt = q / 15 - DMath.fixHour(RA);
    const decl = DMath.arcsin(DMath.sin(e) * DMath.sin(L));

    return { declination: decl, equation: eqt };
  }

  private julian([year, month, day]: number[]) {
    if (month <= 2) {
      year -= 1;
      month += 12;
    }
    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);

    const JD =
      Math.floor(365.25 * (year + 4716)) +
      Math.floor(30.6001 * (month + 1)) +
      day +
      B -
      1524.5;
    return JD;
  }

  private sunAngleTime(
    angle: number,
    time: number,
    direction?: RotationDirection
  ) {
    assert(this.jDate !== undefined, "PrayerTimes.jDate is not defined");
    assert(this.lat !== undefined, "PrayerTimes.lat is not defined");
    const decl = this.sunPosition(this.jDate + time).declination;
    const noon = this.midDay(time);
    const t =
      (1 / 15) *
      DMath.arccos(
        (-DMath.sin(angle) - DMath.sin(decl) * DMath.sin(this.lat)) /
          (DMath.cos(decl) * DMath.cos(this.lat))
      );
    return noon + (direction === "ccw" ? -t : t);
  }

  // ---- Compute Prayer Times ----
  private computeTimes() {
    // default times
    let times: Record<Exclude<TimeName, "midnight">, number> & {
      midnight?: number;
    } = {
      imsak: 5,
      fajr: 5,
      sunrise: 6,
      dhuhr: 12,
      asr: 13,
      sunset: 18,
      maghrib: 18,
      isha: 18,
    };

    for (let i = 1; i <= numIterations; i++)
      times = this.computePrayerTimes(times);

    times = this.adjustTimes(times);

    // add midnight time
    times.midnight =
      this.settings.midnight == "Jafari"
        ? times.sunset + this.timeDiff(times.sunset, times.fajr) / 2
        : times.sunset + this.timeDiff(times.sunset, times.sunrise) / 2;

    times = this.tuneTimes(times as Record<TimeName, number>);
    return this.modifyFormats(times as Record<TimeName, number>);
  }

  // convert times to given time format
  private modifyFormats(
    times: Record<TimeName, number>
  ): Record<TimeName, string> {
    const formattedTimes: Record<TimeName, string> = {
      imsak: "",
      fajr: "",
      sunrise: "",
      dhuhr: "",
      asr: "",
      maghrib: "",
      sunset: "",
      isha: "",
      midnight: "",
    };
    for (const i in times) {
      const time = i as TimeName;
      formattedTimes[time] = this.getFormattedTime(
        times[time],
        this.timeFormat
      );
      console.log(formattedTimes[time]);
    }
    return formattedTimes;
  }

  // convert float time to the given format (see timeFormats)
  private getFormattedTime(time: number, format: TimeFormat) {
    if (isNaN(time)) return invalidTime;
    console.log(`modifying format of ${time} to `, format);
    if (format == "Float") return String(time);

    time = DMath.fixHour(time + 0.5 / 60); // add 0.5 minutes to round
    const hours = Math.floor(time);
    const minutes = Math.floor((time - hours) * 60);
    const suffix = format == "12h" ? timeSuffixes[hours < 12 ? 0 : 1] : "";
    const hour =
      format == "24h"
        ? this.twoDigitsFormat(hours)
        : ((hours + 12 - 1) % 12) + 1;
    const formattedHour =
      hour + ":" + this.twoDigitsFormat(minutes) + (suffix ? " " + suffix : "");
    return formattedHour;
  }

  // apply offsets to the times
  private tuneTimes(times: Record<TimeName, number>) {
    for (const i in times) {
      const time = i as TimeName;
      times[time] += (this.offset[time] ?? 0) / 60;
    }
    return times;
  }

  // compute asr time
  private asrTime(factor: number, time: number) {
    assert(this.jDate !== undefined);
    assert(this.lat !== undefined);
    const decl = this.sunPosition(this.jDate + time).declination;
    const angle = -DMath.arccot(factor + DMath.tan(Math.abs(this.lat - decl)));
    return this.sunAngleTime(angle, time);
  }

  // get asr shadow factor
  private asrFactor(asrParam?: string | number) {
    if (typeof asrParam !== "string") {
      return asrParam ?? 0;
    }
    const factors = { Standard: 1, Hanafi: 2 } as const;
    return (
      factors[asrParam as (typeof asrJuristics)[number]] || this.eval(asrParam)
    );
  }

  private dayPortion(times: Record<Exclude<TimeName, "midnight">, number>) {
    for (const i in times) {
      const time = i as Exclude<TimeName, "midnight">;
      times[time] /= 24;
    }
    return times;
  }

  private riseSetAngle() {
    //var earthRad = 6371009; // in meters
    //var angle = DMath.arccos(earthRad/(earthRad+ elv));
    assert(this.elv !== undefined, "PrayerTimes.elv not defined");
    const angle = 0.0347 * Math.sqrt(this.elv); // an approximation
    return 0.833 + angle;
  }

  private computePrayerTimes(
    times: Record<Exclude<TimeName, "midnight">, number>
  ) {
    times = this.dayPortion(times);
    const params = this.settings;

    const imsak = this.sunAngleTime(
      this.eval(params.imsak),
      times.imsak,
      "ccw"
    );
    const fajr = this.sunAngleTime(this.eval(params.fajr), times.fajr, "ccw");

    const sunrise = this.sunAngleTime(
      this.riseSetAngle(),
      times.sunrise,
      "ccw"
    );
    const dhuhr = this.midDay(times.dhuhr);
    const asr = this.asrTime(this.asrFactor(params.asr), times.asr);
    const sunset = this.sunAngleTime(this.riseSetAngle(), times.sunset);
    const maghrib = this.sunAngleTime(this.eval(params.maghrib), times.maghrib);
    const isha = this.sunAngleTime(this.eval(params.isha), times.isha);

    return {
      imsak: imsak,
      fajr: fajr,
      sunrise: sunrise,
      dhuhr: dhuhr,
      asr: asr,
      sunset: sunset,
      maghrib: maghrib,
      isha: isha,
    };
  }

  private adjustTimes(times: Record<Exclude<TimeName, "midnight">, number>) {
    const params = this.settings;
    for (const i in times) {
      const time = i as Exclude<TimeName, "midnight">;
      assertDefined(this.timeZone);
      assertDefined(this.lng);
      times[time] += this.timeZone - this.lng / 15;
    }

    if (params.highLats != "None") times = this.adjustHighLats(times);

    if (this.isMin(params.imsak))
      times.imsak = times.fajr - this.eval(params.imsak) / 60;
    if (this.isMin(params.maghrib))
      times.maghrib = times?.sunset + this.eval(params.maghrib) / 60;
    if (this.isMin(params.isha))
      times.isha = times?.maghrib + this.eval(params.isha) / 60;
    times.dhuhr += this.eval(params.dhuhr) / 60;

    return times;
  }

  // adjust times for locations in higher latitudes
  private adjustHighLats(times: Record<Exclude<TimeName, "midnight">, number>) {
    const params = this.settings;
    const nightTime = this.timeDiff(times.sunset, times.sunrise);

    times.imsak = this.adjustHLTime(
      times.imsak,
      times.sunrise,
      this.eval(params.imsak),
      nightTime,
      "ccw"
    );
    times.fajr = this.adjustHLTime(
      times.fajr,
      times.sunrise,
      this.eval(params.fajr),
      nightTime,
      "ccw"
    );
    times.isha = this.adjustHLTime(
      times.isha,
      times.sunset,
      this.eval(params.isha),
      nightTime
    );
    times.maghrib = this.adjustHLTime(
      times.maghrib,
      times.sunset,
      this.eval(params.maghrib),
      nightTime
    );

    return times;
  }

  // adjust a time for higher latitudes
  private adjustHLTime(
    time: number,
    base: number,
    angle: number,
    night: number,
    direction?: RotationDirection
  ) {
    const portion = this.nightPortion(angle, night);
    const timeDiff =
      direction == "ccw"
        ? this.timeDiff(time, base)
        : this.timeDiff(base, time);
    if (isNaN(time) || timeDiff > portion)
      time = base + (direction == "ccw" ? -portion : portion);
    return time;
  }

  // the night portion used for adjusting times in higher latitudes
  private nightPortion(angle: number, night: number) {
    const method = this.settings.highLats;
    let portion = 1 / 2; // MidNight
    if (method == "AngleBased") portion = (1 / 60) * angle;
    if (method == "OneSeventh") portion = 1 / 7;
    return portion * night;
  }

  private timeDiff(time1: number | undefined, time2: number | undefined) {
    return DMath.fixHour((time2 ?? 0) - (time1 ?? 0));
  }

  // ----- Misc Functions ----
  private eval(val?: number | string) {
    if (typeof val !== "string") {
      return val ?? 0;
    }
    return Number.parseFloat((val + "").split(/[^0-9.+-]/)[0]);
  }

  // detect if input contains 'min'
  private isMin(arg?: string | number) {
    return typeof arg !== "number" && (arg ?? "").indexOf("min") != -1;
  }

  // add a leading 0 if necessary
  private twoDigitsFormat(num: number) {
    return num < 10 ? "0" + num : num;
  }
}

const prayerTimeCalculator = new PrayTimes("Egypt");
prayerTimeCalculator.adjust({
  timeFormat: "24h",
});
export default prayerTimeCalculator;
