import { ChatRooms } from "@/component/ChatRoom";

type RoomPageProps = {
  params: Promise<{
    roomname: string;
  }>;
};

export default async function RoomPage({
  params,
}: RoomPageProps) {
  const { roomname } = await params;

  const response = await fetch(
    `http://localhost:3003/room/${encodeURIComponent(roomname)}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Failed to load room
          </h1>

          <p className="mt-2 text-gray-500">
            Backend returned HTTP {response.status}.
          </p>
        </div>
      </main>
    );
  }

  const data = await response.json();

  if (!data.room) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Room not found
          </h1>

          <p className="mt-2 text-gray-500">
            Room: {roomname}
          </p>
        </div>
      </main>
    );
  }

  return <ChatRooms id={data.room.id} />;
}