export interface PolygonBase {
  name: string;
  address: string;
  type: string;
  coordinates: number[][];
}

export interface Polygon extends PolygonBase {
  id: number;
}

export interface PolygonData {
  id: string;
  leafletID: string;
  name: string;
  address: string;
  type: string;
  coordinates: L.LatLng[];
}

export interface CreatePolygonData {
  name: string;
  address: string;
  type: string;
  coordinates: L.LatLng[];
}

export interface UpdatePolygonData {
  id: string;
  name: string;
  address: string;
  type: string;
  coordinates: L.LatLng[];
}