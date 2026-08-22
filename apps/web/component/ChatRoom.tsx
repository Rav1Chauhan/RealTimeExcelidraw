import axios from "axios";

import { BACKEND_URL } from "../app/config";
import { ChatRoomClient } from "./ChatRoomClient";

async function getChats(roomId: string) {
  const response = await axios.get(
    `${BACKEND_URL}/chats/${roomId}`
  );

  return response.data.messages ?? [];
}

export async function ChatRooms({
  id,
}: {
  id: string;
}) {
  if (!id) {
    throw new Error("Room ID is missing");
  }

  const messages = await getChats(id);

  return (
    <ChatRoomClient
      id={id}
      messages={messages}
    />
  );
}