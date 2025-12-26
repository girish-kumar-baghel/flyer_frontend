import { AuthStore} from "./AuthStore";
import { CartStore } from "./CartStore";
import { FlyerFormStore } from "./FlyerFormStore";

export const store = {
  FlyerFormStore,
  CartStore,
  AuthStore,     // ✅ add here
};

export type RootStore = typeof store;
