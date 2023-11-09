export type MarkerLocationWithCenter = {
  lat: number;
  lng: number;
  description: string;
  center: boolean;
};

export type MarkerLocation = Exclude<MarkerLocationWithCenter, "center">;
