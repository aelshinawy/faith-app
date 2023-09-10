import { atom } from "jotai/vanilla";

const currentDateTime = atom(new Date());
export const updateDateTimeAtom = atom(null, (get, set) => {
  console.log("hey bish. updating the time, BOIII");
  set(currentDateTime, new Date());
});

export default currentDateTime;
