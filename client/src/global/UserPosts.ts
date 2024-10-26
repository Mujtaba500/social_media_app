import { atom } from "recoil";
import { Post } from "../types";

const userPostsState = atom<Post[]>({
  key: "userPostState", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});

export default userPostsState;