import { Geolocation as geolocation, Position } from "@capacitor/geolocation";
import { PermissionState } from "@capacitor/core";
import axios, { AxiosResponse } from "axios";
import appDB from "./appDB";

const ipStackAccessKey = "e44d3e828aa2f71545b75de478a3a09d";

interface IpStackData {
  city?: string;
  continent_code?: string;
  continent_name?: string;
  country_code: string;
  country_name: string;
  ip?: string;
  latitude: number;
  longitude: number;
  location: any;
  region_code?: string;
  region_name?: string;
  type?: "ipv4" | "ipv6";
  zip?: null | string | number;
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
    .catch(async () => {
      appDB.get("geolocation").then((val) => {
        console.log("couldn't get location using ip, relying on storage", val);
      });
      const cachedData = (await appDB.get("geolocation")) ?? {};
      return {
        data: {
          country_code: cachedData.country_code,
          country_name: cachedData.country_name,
          latitude: cachedData.coords[0],
          longitude: cachedData.coords[1],
        },
      } as AxiosResponse<IpStackData>;
    });

  console.log(ipstackLocation);
  const locationData: LocationData = {
    country_code: ipstackLocation.country_code,
    country_name: ipstackLocation.country_name,
    coords: [ipstackLocation.latitude, ipstackLocation.latitude],
  };

  console.log("current location data: ");

  let coords: Position["coords"];

  console.log("access is currently: ", access);

  switch (access) {
    case undefined:
    case "unavailable":
    case "denied":
    case "prompt":
    case "prompt-with-rationale":
      //TODO: figure out what "prompt" and "prompt-with-rationale"
      appDB.set("geolocation", locationData).then((val) => {
        console.log("location has been set to", locationData);
      });
      return locationData;
    case "granted":
      coords = await geolocation.getCurrentPosition().then((pos) => pos.coords);
      locationData.coords = [coords.latitude, coords.longitude];

      appDB.set("geolocation", locationData).then((val) => {
        console.log("location has been set to", locationData);
      });
      return locationData;
    default:
      throw "yikes, how'd that happen?";
  }
};
