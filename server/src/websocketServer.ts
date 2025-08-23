import { WebSocketServer } from "ws";
import {
  //   removeElementFromArray,
  extractUserFromToken,
  getTokenFromParams,
} from "./utils/helpers.js";
import { user } from "./types/types.js";

interface connection {
  ws: WebSocket;
  user: user;
}
const connections: connection[] = [];

const webSocketServerInit = (wss: WebSocketServer) => {
  wss.on("connection", function connection(ws, req) {
    ws.on("error", console.error);
    const numClients = wss.clients.size;

    if (ws.readyState === ws.OPEN) {
      console.log("Clients connected", numClients);

      const token = getTokenFromParams(req);

      const user = extractUserFromToken(token);

      //@ts-ignore
      user && connections.push({ user, ws });

      console.log(connections);
    }

    ws.on("close", function close() {
      // removeElementFromArray()
    });
  });
};

const broadCastDataToClients = (clients: connection[], data: any) => {
  clients.length &&
    clients.forEach((client) => {
      console.log(`Data to send to client: ${client?.user?.userId}`, data);
      client.ws.send(JSON.stringify(data));
    });
};

export const sendDataToClient = (userId: string, data: any) => {
  // Can have multiple notification page opened for the same client
  const clients = connections.filter(
    (client) => client?.user?.userId === userId
  );

  broadCastDataToClients(clients, data);
};

export default webSocketServerInit;
