import L from 'leaflet';
import { Polygon, PolygonData, CreatePolygonData, UpdatePolygonData } from '../../app/types';

const API_BASE_URL = "http://localhost:8000";

const POLYGONS_URL = `${API_BASE_URL}/polygons`;

export const polygonEndpoints = {
  getAll: `${POLYGONS_URL}/`,
  create: `${POLYGONS_URL}/createPolygon/`,
  update: (id: string) => `${POLYGONS_URL}/updatePolygon/${id}`,
  delete: (id: string) => `${POLYGONS_URL}/deletePolygon/${id}`,
};

export const getPolygons = async (): Promise<PolygonData[]> => {
  try{
    const response = await fetch(polygonEndpoints.getAll, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch polygons");
    }
    const jsonData: Polygon[] = await response.json();
    const convertedData: PolygonData[] = jsonData.map(polygon => ({
      id: polygon.id.toString(), // Convert id to string if needed
      leafletID: "", // Placeholder for Leaflet ID, adjust as needed
      name: polygon.name,
      address: polygon.address,
      type: polygon.type,
      coordinates: polygon.coordinates.map(coord => L.latLng(coord[1], coord[0])) // Convert coordinates to L.latLng
    }));
    return convertedData;
  } catch (error) {
    console.error("Error fetching polygons:", error);
    throw error; // Propagate the error for handling in the component
  }
};

export const createPolygon = async (data: CreatePolygonData) => {
  const coordinates: number[][] = data.coordinates.map((latlng) => [latlng.lng, latlng.lat]);
  // Ensure the polygon is closed by adding the first point at the end
  if (coordinates.length > 0) {
    coordinates.push(coordinates[0]); // Push the first point to close the polygon
  }
  const payload = {
    ...data,
    coordinates: coordinates,
  };
  try {
    const response = await fetch(polygonEndpoints.create, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error("Failed to create polygon");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating polygon:", error);
    throw error; // Propagate the error for handling in the component
  }
}


export const updatePolygon = async (data: UpdatePolygonData): Promise<PolygonData> => {
  const coordinates: number[][] = data.coordinates.map((latlng) => [latlng.lng, latlng.lat]);
  // Ensure the polygon is closed by adding the first point at the end
  if (coordinates.length > 0) {
    coordinates.push(coordinates[0]); // Push the first point to close the polygon
  }
  const payload = {
    ...data,
    coordinates: coordinates,
  };
  try {
    const response = await fetch(polygonEndpoints.update(data.id), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`Failed to update polygon with id ${data.id}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating polygon with id ${data.id}:`, error);
    throw error; // Propagate the error for handling in the component
  }
};


export const deletePolygon = async (id: number): Promise<void> => {
  try {
    const response = await fetch(polygonEndpoints.delete(id.toString()), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to delete polygon with id ${id}`);
    }
  } catch (error) {
    console.error(`Error deleting polygon with id ${id}:`, error);
    throw error; // Propagate the error for handling in the component
  }
};

