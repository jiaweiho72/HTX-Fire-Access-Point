import L from 'leaflet';
// types.ts

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

export interface createPolygonData {
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


// Function to save a polygon
export const createPolygon = async (data: createPolygonData) => {
  const coordinates: number[][] = data.coordinates.map(latlng => [latlng.lng, latlng.lat]);
  // Ensure the polygon is closed by adding the first point at the end
  if (coordinates.length > 0) {
    coordinates.push(coordinates[0]);  // Push the first point to close the polygon
  }

  const payload = {
    ...data,
    coordinates: coordinates,
  };

  console.log(payload)

  const response = await fetch("http://localhost:8000/polygons/createPolygon/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return await response.json();
};

export const test = async () => {
  const response = await fetch("http://localhost:8000/polygons/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
}

export const updatePolygon = async (data: UpdatePolygonData): Promise<PolygonData> => {
  const coordinates: number[][] = data.coordinates.map(latlng => [latlng.lng, latlng.lat]);
  // Ensure the polygon is closed by adding the first point at the end
  if (coordinates.length > 0) {
    coordinates.push(coordinates[0]);  // Push the first point to close the polygon
  }

  const payload = {
    ...data,
    coordinates: coordinates,
  };

  const response = await fetch(`http://localhost:8000/polygons/updatePolygon/${data.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return await response.json();
};

export const getPolygons = async (): Promise<PolygonData[]> => {
  const response = await fetch("http://localhost:8000/polygons/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const jsonData: Polygon[] = await response.json();
  const convertedData: PolygonData[] = jsonData.map(polygon => ({
    id: polygon.id.toString(), // Convert id to string if needed
    leafletID: "", // Placeholder for Leaflet ID, adjust as needed
    name: polygon.name,
    address: polygon.address,
    type: polygon.type,
    coordinates: polygon.coordinates.map(coord => L.latLng(coord[1], coord[0])) // Convert coordinates to L.latLng
  }));

  console.log(convertedData)

  return convertedData;
};

// export const getPolygons = async () => {
//   const convertedData = [
//     {
//       id: "1",
//       leafletID: "",
//       name: "Polygon 2",
//       address: "123 Main St",
//       type: "Type A",
//       coordinates: [
//         L.latLng(1.3149332, 103.831717),
//         L.latLng(1.3249332, 103.8931717),
//         L.latLng(1.3549332, 103.8731717),
//       ],
//     },
//     {
//       id: "2",
//       leafletID: "",
//       name: "Polygon 1",
//       address: "456 Elm St",
//       type: "Type B",
//       coordinates: [
//         L.latLng(1.3449332, 103.6931717),
//         L.latLng(1.3349332, 103.6931717),
//         L.latLng(1.3149332, 103.7931717),
//         L.latLng(1.3249332, 103.7931717),
//       ],
//     },
//   ];

//   console.log(convertedData)
//   return convertedData
// };


// export const deletePolygon = async (id: number): Promise<PolygonData> => {
//   const response = await fetch(`http://localhost:8000/polygons/deletePolygon/${id}`, {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   if (!response.ok) {
//     throw new Error(`Failed to delete polygon with id ${id}`);
//   }

//   const jsonData = await response.json();

//   const convertedData: PolygonData = {
//     id: jsonData.id.toString(), // Convert id to string if needed
//     leafletID: "", // Placeholder for Leaflet ID, adjust as needed
//     name: jsonData.name,
//     address: jsonData.address,
//     type: jsonData.type,
//     coordinates: jsonData.coordinates.map((coord: number[]) => L.latLng(coord[1], coord[0])) // Convert coordinates to L.latLng
//   };

//   return convertedData;
// };


export const deletePolygon = async (id: number): Promise<void> => {
  const response = await fetch(`http://localhost:8000/polygons/deletePolygon/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete polygon with id ${id}`);
  }
};
