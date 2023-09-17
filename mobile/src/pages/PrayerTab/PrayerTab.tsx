import React, { useEffect, useMemo, useReducer } from "react";
import "./PrayerTab.css";
import PrayerTabTemplate from "./PrayerTab.template";
import {
  getGeolocation,
  getGeolocationAvailability,
} from "../../utils/geolocation";
import { useQuery } from "react-query";
import prayerTimeCalculator, {
  orderedTimeNames,
  TimeName,
} from "../../utils/PrayerTimeCalculator";
import { assertDefined } from "../../utils/assert";
import { formattedTimeToDate, nextDay, prevDay } from "../../utils/time";
import { useAtom } from "jotai/react";
import { timeFormatAtom } from "../../atoms/userOptions";
import { currentTimeNameAtom, prayerTimesAtom } from "../../atoms/time";

type Increment = { type: "increment" };
type Decrement = { type: "decrement" };

function getTimeStatus(
  prayerTimes: Record<TimeName, string>,
  setCurrentTime?: (time: Exclude<TimeName, "sunset">) => void
): Partial<
  Record<Exclude<TimeName, "sunset">, "past" | "current" | "upcoming">
> {
  if (prayerTimes.fajr === "") return {};

  let foundCurrent = false;
  const res: Partial<Record<TimeName, "past" | "current" | "upcoming">> = {};
  orderedTimeNames.forEach((val, index) => {
    const pevTimeName = orderedTimeNames[index - 1] as Exclude<
      TimeName,
      "sunset"
    >;
    const timeName = val as Exclude<TimeName, "sunset">;

    const timeStart = formattedTimeToDate(prayerTimes[timeName]);
    const timeStarted = timeStart.valueOf() <= new Date().valueOf();
    if (!foundCurrent) {
      if (!timeStarted) {
        res[pevTimeName] = "current";
        if (setCurrentTime !== undefined) {
          setCurrentTime(pevTimeName);
        }
        foundCurrent = true;
      } else {
        res[timeName] = "past";
      }
    }
    if (foundCurrent) {
      res[timeName] = "upcoming";
    }
  });
  return res;
}

function currentDateReducer(currentDate: Date, action: Increment | Decrement) {
  switch (action.type) {
    case "increment":
      return nextDay(currentDate);
    case "decrement":
      return prevDay(currentDate);
  }
}

const PrayerTab: React.FC = () => {
  const {
    data: locationData,
    isFetching: isFetchingLocationData,
    isSuccess: isSuccessLocationData,
  } = useQuery(
    "location",
    async () => await getGeolocation(await getGeolocationAvailability())
  );

  const [, setCurrentTime] = useAtom(currentTimeNameAtom);
  const [timeFormat] = useAtom(timeFormatAtom);
  const [currentDate, dateDispatch] = useReducer(
    currentDateReducer,
    new Date()
  );
  const [prayerTimes, setPrayerTimes] = useAtom(prayerTimesAtom);
  const timeStatus: Partial<Record<TimeName, "past" | "current" | "upcoming">> =
    useMemo(() => {
      return getTimeStatus(prayerTimes, setCurrentTime);
    }, [prayerTimes]);

  const onNextDay = () => {
    dateDispatch({
      type: "increment",
    });
  };
  const onPrevDay = () => {
    dateDispatch({
      type: "decrement",
    });
  };

  useEffect(() => {
    if (isSuccessLocationData) {
      assertDefined(locationData);
      const times = prayerTimeCalculator.getTimes(
        currentDate,
        locationData?.coords,
        "auto",
        "auto",
        timeFormat
      );
      console.log(
        `%cmaghrib: ${times.maghrib}, sunset: ${times.sunset}`,
        "color: yellow;"
      );
      setPrayerTimes(times);
    }
  }, [isFetchingLocationData]);

  return (
    <PrayerTabTemplate
      onNextDay={onNextDay}
      onPrevDay={onPrevDay}
      prayerTimes={prayerTimes}
      timeStatus={timeStatus}
    />
  );
};

export default PrayerTab;
