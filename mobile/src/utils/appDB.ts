import { Storage } from "@ionic/storage";
import { LocationData } from "./geolocation";

interface Store {
  geolocation: LocationData;
}

type Key = keyof Store;

class AppDB {
  private store = new Storage();

  async create() {
    return await this.store.create();
  }

  async set(key: Key, value: Store[Key]) {
    return await this.store.set(key, value);
  }

  async get(key: Key) {
    return await this.store.get(key);
  }

  async delete(key: Key) {
    return await this.store.remove(key);
  }

  async clear() {
    return await this.store.clear();
  }

  async keys() {
    return (await this.store.keys()) as Key[];
  }

  async length() {
    return await this.store.length();
  }
}

const appDB = new AppDB();
await appDB.create();

export default appDB;
