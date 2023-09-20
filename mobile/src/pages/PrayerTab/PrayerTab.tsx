import React, { useEffect, useMemo, useReducer } from "react";
import "./PrayerTab.css";
import PrayerTabTemplate from "./PrayerTab.template";

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
import {
  getGeolocation_cache,
  getGeolocation_gps,
  getGeolocation_ip,
  LocationData,
} from "../../utils/geolocation";

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
  const locationQuery_cache = useQuery("location_cache", getGeolocation_cache);
  const locationQuery_gps = useQuery("location_gps", getGeolocation_gps);
  const locationData: LocationData = locationQuery_cache.isSuccess
    ? locationQuery_cache.data ?? {}
    : {};
  if (locationQuery_gps.isSuccess) {
    assertDefined(locationQuery_gps.data.coords);
    locationData.coords = locationQuery_gps.data.coords;
  }
  // const countryMissing = locationData.country_code === undefined,
  //   coordsMissing = locationData.coords === undefined;
  const locationQuery_ip = useQuery("location_ip", async () =>
    getGeolocation_ip()
  );
  // if(countryMissing){
  //   locationData.country_code = locationQuery_ip.data.country_code
  // }
  // if(coordsMissing){
  //
  // }

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
    if (locationData.coords) {
      assertDefined(locationData);
      const times = prayerTimeCalculator.getTimes(
        currentDate,
        locationData.coords,
        "auto",
        "auto",
        timeFormat
      );
      setPrayerTimes(times);
    }
  }, [locationData.coords]);

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
