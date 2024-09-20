import { atom } from "recoil";
import { User } from "../types";

const suggestedUsersState = atom<User[]>({
  key: "suggestedUsersState", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});

export default suggestedUsersState;
