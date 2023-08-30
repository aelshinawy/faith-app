import React, { useEffect, useState } from "react";
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

const PrayerTab: React.FC = () => {
  const {
    data: locationData,
    isFetching,
    isSuccess,
  } = useQuery(
    "location",
    async () => await getGeolocation(await getGeolocationAvailability())
  );

  const [currentDate, setCurrentDate] = useState(new Date());
  const [prayerTimes, setPrayerTimes] = useState<Record<TimeName, string>>();

  useEffect(() => {
    if (isSuccess) {
      assertDefined(locationData);
      setPrayerTimes(
        prayerTimeCalculator.getTimes(currentDate, locationData?.coords)
      );
    }
  }, [isFetching]);

  return <PrayerTabTemplate prayerTimes={prayerTimes} />;
};

export default PrayerTab;
