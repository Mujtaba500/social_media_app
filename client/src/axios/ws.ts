const stage = import.meta.env.MODE;

let baseURL: any;

if (stage === "production") {
  baseURL = `ws://${import.meta.env.VITE_BACKEND_URL}`;
} else if (stage === "development") {
  baseURL = "ws://localhost:4000";
}

const token = localStorage.getItem("access_token")!;

export const newSocketConnection = () => {
  return new WebSocket(`${baseURL}?token=${token}`);
};
