import RoomCanvas from "@/components/Roomcanvas";

export default async function CanvasPage({
  params,
}: {
  params: {
    roomId: string;
  };
}) {
  const roomName = (await params).roomId;

  return <RoomCanvas roomName={roomName} />;
}