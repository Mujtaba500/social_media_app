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
      ws.send("connected!");
      console.log("Clients connected", numClients);

      const token = getTokenFromParams(req);

      const user = extractUserFromToken(token);

      //@ts-ignore
      user && connections.push({ user, ws });
    }

    ws.on("close", function close() {
      // removeElementFromArray()
    });
  });
};

const broadCastDataToClients = (clients: connection[], data: any) => {
  clients.length &&
    clients.forEach((client) => {
      client.ws.send(data);
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

//  {
//             "id": "da4f6a17-5df7-4232-9d6e-aa167d35307b",
//             "type": "POST_LIKE",
//             "sentFrom": {
//                 "id": "081a0370-03a6-49f5-bed3-10258ca7ae7e",
//                 "username": "luffy123",
//                 "profilepic": "https://res.cloudinary.com/dhmgdzb0v/image/upload/v1734244181/social_media_app/ejfftohjwugjxky1ctv7.jpg"
//             }
//         },
