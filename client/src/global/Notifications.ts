import { atom } from "recoil";
import { Notification } from "../types";

const notificationsState = atom<Notification[]>({
  key: "notificationState", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});

export default notificationsState;
