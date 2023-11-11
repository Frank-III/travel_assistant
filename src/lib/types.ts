
export interface Message {
  message: string;
  sender: "user" | "assistant";
  meta: unknown;
}

export type MarkerLocationWithCenter = {
  lat: number;
  lng: number;
  description: string;
  property: "main" | "entertainment" | "landscape";
};

export type MarkerLocation = Exclude<MarkerLocationWithCenter, "center">;
