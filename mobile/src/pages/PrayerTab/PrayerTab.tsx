import React, { useEffect, useReducer, useState } from "react";
import "./PrayerTab.css";
import PrayerTabTemplate from "./PrayerTab.template";
import {
  getGeolocation,
  getGeolocationAvailability,
} from "../../utils/geolocation";
import { useQuery } from "react-query";
import prayerTimeCalculator, {
  TimeName,
} from "../../utils/PrayerTimeCalculator";
import { assertDefined } from "../../utils/assert";
import { nextDay, prevDay } from "../../utils/time";

type Increment = { type: "increment" };
type Decrement = { type: "decrement" };

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

  const [currentDate, dateDispatch] = useReducer(
    currentDateReducer,
    new Date()
  );
  const [prayerTimes, setPrayerTimes] = useState<Record<TimeName, string>>();

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
      setPrayerTimes(
        prayerTimeCalculator.getTimes(currentDate, locationData?.coords)
      );
    }
  }, [isFetchingLocationData]);

  return (
    <PrayerTabTemplate
      onNextDay={onNextDay}
      onPrevDay={onPrevDay}
      prayerTimes={prayerTimes}
    />
  );
};

export default PrayerTab;
