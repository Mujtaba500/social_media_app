import { atom } from "recoil";
import { Post } from "../types";

const postsState = atom<Post[]>({
  key: "postState", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});

export default postsState;
