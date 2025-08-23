import app from "./app.js";
import http from "http";
import { WebSocketServer } from "ws";
import webSocketServerInit from "./websocketServer.js";

const port = process.env.PORT;

const server = http.createServer();

server.on("request", app);

const wss = new WebSocketServer({ server });

webSocketServerInit(wss);

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
