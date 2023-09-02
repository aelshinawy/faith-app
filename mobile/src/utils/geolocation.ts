import { Geolocation as geolocation, Position } from "@capacitor/geolocation";
import { PermissionState } from "@capacitor/core";
import axios, { AxiosResponse } from "axios";
import appDB from "./appDB";

const ipStackAccessKey = "e44d3e828aa2f71545b75de478a3a09d";

interface IpStackData {
  city: string;
  continent_code: string;
  continent_name: string;
  country_code: string;
  country_name: string;
  ip: string;
  latitude: number;
  longitude: number;
  location: any;
  region_code: string;
  region_name: string;
  type: "ipv4" | "ipv6";
  zip: null | string | number;
}

export interface LocationData {
  country_code?: string;
  country_name?: string;
  coords: [number, number];
}

export const getGeolocationAvailability = async () => {
  const geolocationAccess: "unavailable" | PermissionState = await geolocation
    .checkPermissions()
    .then(async (status) => {
      if (status.coarseLocation !== "granted") {
        const newStatus = await geolocation.requestPermissions().catch(() => {
          return { coarseLocation: "unavailable" } as {
            coarseLocation: typeof geolocationAccess;
          };
        });
        return newStatus.coarseLocation;
      } else {
        return status.coarseLocation;
      }
    })
    .catch((err) => {
      console.error(err);
      return "unavailable";
    });

  return geolocationAccess;
};

export const getGeolocation = async (
  access?: "unavailable" | PermissionState
) => {
  const { data: ipstackLocation }: AxiosResponse<IpStackData> = await axios
    .get(`http://api.ipstack.com/check?access_key=${ipStackAccessKey}`)
    .catch(() => {
      console.log("couldn't get location using ip, relying on storage");
      return appDB.get("geolocation");
    });

  const locationData: LocationData = {
    country_code: ipstackLocation.country_code,
    country_name: ipstackLocation.country_name,
    coords: [ipstackLocation.latitude, ipstackLocation.latitude],
  };

  let coords: Position["coords"];

  switch (access) {
    case undefined:
    case "denied":
    case "prompt":
    case "prompt-with-rationale":
      //TODO: figure out what "prompt" and "prompt-with-rationale"
      return locationData;
    case "granted":
      coords = await geolocation.getCurrentPosition().then((pos) => pos.coords);
      locationData.coords = [coords.latitude, coords.longitude];
      return locationData;
    default:
      throw "yikes, how'd that happen?";
  }
};
