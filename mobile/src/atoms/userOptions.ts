import { atom } from "jotai/vanilla";
import { TimeFormat } from "../utils/PrayerTimeCalculator";

export const timeFormatAtom = atom<TimeFormat>("12h");
