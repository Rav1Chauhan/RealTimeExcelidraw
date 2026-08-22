import { api } from "@/lib/api";
import { Shape } from "./types";

type ShapesResponse = {
  shapes: Shape[];
};

export async function getExistingShapes(
  roomName: string
): Promise<Shape[]> {
  try {
    const url = `/rooms/${encodeURIComponent(roomName)}/shapes`;

    const response = await api.get<ShapesResponse>(url);

    return response.data.shapes;
  } catch {
    return [];
  }
}