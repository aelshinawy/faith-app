import { atom } from "jotai/vanilla";
import { TimeName } from "../utils/PrayerTimeCalculator";

const currentDateTimeAtom = atom(new Date());
export const updateDateTimeAtom = atom(null, (get, set) => {
  set(currentDateTimeAtom, new Date());
});

export const currentTimeNameAtom = atom<Exclude<TimeName, "sunset">>("fajr");

export const prayerTimesAtom = atom<Record<TimeName, string>>({
  imsak: "",
  fajr: "",
  sunrise: "",
  dhuhr: "",
  asr: "",
  sunset: "",
  maghrib: "",
  isha: "",
  midnight: "",
});
export default currentDateTimeAtom;
