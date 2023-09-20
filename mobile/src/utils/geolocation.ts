import { Geolocation as geolocation } from "@capacitor/geolocation";
import appDB from "./appDB";

export interface LocationData {
  country_code?: string;
  country_name?: string;
  coords?: [number, number];
}

export const getGeolocation_cache = async () => {
  return await appDB.get("geolocation").then((val: unknown) => {
    return val as LocationData;
  });
};

export const getGeolocation_gps = async () => {
  return await geolocation.getCurrentPosition().then(
    (pos): LocationData => ({
      coords: [pos.coords.latitude, pos.coords.longitude],
    })
  );
};

export const getGeolocation_ip = async (abort?: boolean) => {
  throw "getGeolocation_ip not implemented";
};
