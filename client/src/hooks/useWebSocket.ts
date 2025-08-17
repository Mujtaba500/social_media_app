import { newSocketConnection } from "../axios/ws";

const useWebSocket = () => {
  const currentWS = newSocketConnection();

  currentWS.onopen = () => {
    console.log("WebSocket connected");
  };

  currentWS.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  currentWS.onclose = () => {
    console.log("WebSocket disconnected");
  };

  return { currentWS };
};

export default useWebSocket;
