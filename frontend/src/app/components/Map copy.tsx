import React, { useRef, useState, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, Tooltip, Popup, Marker, Polygon, Polyline} from "react-leaflet";
import { LatLng, LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";

import { FeatureGroup, Circle } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw";
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// To fix formatting missing icons issue
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});

// PolygonData interface
interface PolygonData {
  name: string;
  address: string;
  type: string;
  coordinates: LatLng[];
}

const Map: React.FC = () => {
  const [polygons, setPolygons] = useState<PolygonData[]>([]);
  const [popupPosition, setPopupPosition] = useState<LatLng | null>(null);
  const [polygonCoordinates, setPolygonCoordinates] = useState<LatLng[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const typeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log('polygonCoordinates has been updated:', polygonCoordinates);
  }, [polygonCoordinates]);

  const handleSave = () => {
    const name = nameRef.current?.value || "";
    const address = addressRef.current?.value || "";
    const type = typeRef.current?.value || "";
    const newPolygon: PolygonData = { name, address, type, coordinates: polygonCoordinates };
    setPolygons([...polygons, newPolygon]);
    setShowPopup(false); // Close popup after saving
    setPolygonCoordinates([]); // Clear the coordinates
    console.log("Polygon saved:", newPolygon);
  };

  const handleEdit = (index: number) => {
    console.log(index)
    console.log(polygons)
    const name = nameRef.current?.value || "";
    const address = addressRef.current?.value || "";
    const type = typeRef.current?.value || "";
  
    setPolygons(prevPolygons => {
      const updatedPolygons = [...prevPolygons];
      updatedPolygons[index] = { ...updatedPolygons[index], name, address, type };
      return updatedPolygons;
    });
  
    setShowPopup(false); // Close popup after saving
    console.log("Polygon updated:", polygons[index]);
  };

  const _created = (e: any) => {
    const latlngs = e.layer.getLatLngs()[0]; // Assuming a single polygon is created
    setPolygonCoordinates(latlngs);
    setPopupPosition(latlngs[0]);
    setShowPopup(true); // Show the popup when a polygon is created
  };

  return (
    <div>
      <MapContainer center={[1.2949332, 103.7931717]} zoom={13} style={{ height: "400px", width: "100%" }}>
        <TileLayer
          url='https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png'
          detectRetina={true}
          minZoom={9}
          maxZoom={23}
          maxNativeZoom={18}
          attribution='&copy; <img src="https://www.onemap.gov.sg/web-assets/images/logo/om_logo.png" style="height:20px;width:20px;"/>&nbsp;<a href="https://www.onemap.gov.sg/" target="_blank" rel="noopener noreferrer">OneMap</a>&nbsp;&copy;&nbsp;contributors&nbsp;&#124;&nbsp;<a href="https://www.sla.gov.sg/" target="_blank" rel="noopener noreferrer">Singapore Land Authority</a>'
        />
        <FeatureGroup>
          <EditControl
            position='topright'
            onCreated={_created}
            draw={{
              polyline: false,
              circlemarker: false,
            }}
          />
          {showPopup && (
            <div>
              <Popup>
                <div>
                  <input type="text" placeholder="Name" ref={nameRef} />
                  <input type="text" placeholder="Address" ref={addressRef} />
                  <input type="text" placeholder="Type" ref={typeRef} />
                  <button onClick={handleSave}>Save</button>
                </div>
              </Popup>
              <Tooltip direction="bottom" offset={[0, 20]} opacity={1}>
              <div>
                <h1>Test</h1>
              </div>
            </Tooltip>
          </div>
          )}
        

          {/* Display existing polygons */}
          {/* {polygons.map((polygon, index) => (
            <Polygon key={index} positions={polygon.coordinates}>
              <Tooltip direction="bottom" offset={[0, 20]} opacity={1}>
                <div>
                  <div><strong>Name:</strong> {polygon.name}</div>
                  <div><strong>Address:</strong> {polygon.address}</div>
                  <div><strong>Type:</strong> {polygon.type}</div>
                </div>
              </Tooltip>
              <Popup>
                <div>
                  <input type="text" placeholder="Name" defaultValue={polygon.name} ref={nameRef} />
                  <input type="text" placeholder="Address" defaultValue={polygon.address} ref={addressRef} />
                  <input type="text" placeholder="Type" defaultValue={polygon.type} ref={typeRef} />
                  <button onClick={() => handleEdit(index)}>Save Edit</button>
                </div>
              </Popup>
            </Polygon>
          ))} */}
        </FeatureGroup>
      </MapContainer>
    </div>
  );
};

export default Map;























// import React, { useRef, useState, useEffect } from "react";
// import { MapContainer, TileLayer, Tooltip, Popup, Polygon, Marker } from "react-leaflet";
// import { LatLng } from "leaflet";
// import "leaflet/dist/leaflet.css";
// import { FeatureGroup } from 'react-leaflet';
// import { EditControl } from "react-leaflet-draw";
// import 'leaflet-draw/dist/leaflet.draw.css';
// import L from 'leaflet';


// const default_coordinates: L.LatLng = L.latLng(1.2949332, 103.7931717);

// const fakePolygons: PolygonData[] = [
//   {
//     id: "1",
//     name: "Polygon 1",
//     address: "123 Main St",
//     type: "Type A",
//     coordinates: [
//       L.latLng(1.3149332, 103.831717),
//       L.latLng(1.3249332, 103.8931717),
//       L.latLng(1.3549332, 103.8731717),
//     ],
//   },
//   {
//     id: "2",
//     name: "Polygon 2",
//     address: "456 Elm St",
//     type: "Type B",
//     coordinates: [
//       L.latLng(1.3449332, 103.6931717),
//       L.latLng(1.3349332, 103.6931717),
//       L.latLng(1.3149332, 103.7931717),
//       L.latLng(1.3249332, 103.7931717),


//     ],
//   },
//   // Add more polygons as needed
// ];


// // Formatting missing icons
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
//   iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
//   shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
// });

// // PolygonData interface
// interface PolygonData {
//   id: string;
//   name: string;
//   address: string;
//   type: string;
//   coordinates: LatLng[];
// }


// const Map: React.FC = () => {
//   // const [polygons, setPolygons] = useState<PolygonData[]>([]);
//   const [polygons, setPolygons] = useState<PolygonData[]>(fakePolygons);

//   const [popupPosition, setPopupPosition] = useState<LatLng>(default_coordinates);
//   const [polygonCoordinates, setPolygonCoordinates] = useState<LatLng[]>([]);
//   const [showPopup, setShowPopup] = useState<boolean>(false);

//   const [currentPolygonId, setCurrentPolygonId] = useState<string | null>(null);

//   const nameRef = useRef<HTMLInputElement>(null);
//   const addressRef = useRef<HTMLInputElement>(null);
//   const typeRef = useRef<HTMLInputElement>(null);

//   const [map, setMap] = useState(null);
//   const popupElRef = useRef(null);


//   useEffect(() => {
//     console.log("Updated list of Polygons:", polygons);
//     console.log("Type Polygon id:", typeof(parseInt(polygons[0]?.id)) || "No polygons found.");
//   }, [polygons]);

//   const handleEdit = (polygonId: string) => {
//     const name = nameRef.current?.value || "";
//     const address = addressRef.current?.value || "";
//     const type = typeRef.current?.value || "";
//     setPolygons(polygons.map(polygon => 
//       polygon.id === polygonId ? { ...polygon, name, address, type } : polygon
//     ));
//     setShowPopup(false); // Close popup after saving
//     setCurrentPolygonId(null); // Reset current polygon id

//     if (!popupElRef.current || !map) return;
//     popupElRef.current._close();

//     console.log("Polygon edited:", polygonId);
//   };

//   const handleSave = () => {
//     const name = nameRef.current?.value || "";
//     const address = addressRef.current?.value || "";
//     const type = typeRef.current?.value || "";
    
//     // Update the existing polygon with the new details
//     setPolygons(polygons.map(polygon => 
//       polygon.id === currentPolygonId ? { ...polygon, name, address, type } : polygon
//     ));
  
//     setShowPopup(false); // Close popup after saving
//     setCurrentPolygonId(null); // Reset current polygon id

//     if (!popupElRef.current || !map) return;
//     popupElRef.current._close();

//     console.log("Polygon saved:", currentPolygonId);
//   };

//   const _created = (e: any) => {
//     const latlngs = e.layer.getLatLngs()[0];
//     const id = e.layer._leaflet_id.toString(); // Use the leaflet layer id as the polygon id
//     setPolygonCoordinates(latlngs);
//     setPopupPosition(latlngs[0]);
//     setCurrentPolygonId(id); // Set current polygon id
//     setShowPopup(true); // Show the popup when a polygon is created
  
//     // Create the new polygon object and add it to the state
//     const newPolygon: PolygonData = {
//       id,
//       name: "",
//       address: "",
//       type: "",
//       coordinates: latlngs,
//     };
//     setPolygons(prevPolygons => [...prevPolygons, newPolygon]);
//   };

//   const _initialise = (e: any, polygon: PolygonData) => {
//     if (!e || !polygon) {
//       console.error("Invalid event or polygon data:", { e, polygon });
//       // return;
//     }
  
//     const id = e.target?._leaflet_id?.toString();
//     if (!id) {
//       console.error("Invalid layer or layer ID:", e);
//       // return;
//     }
  
//     // Update the existing polygon object with the new ID
//     setPolygons(prevPolygons =>
//       prevPolygons.map(p =>
//         p == polygon ? { ...p, id } : p
//       )
//     );
//   };
  
  
  
  


  
//   const _deleted = (e: any) => {
//     console.log("deleted called")
//     const deletedIds = e.layers.getLayers().map((layer: any) => layer._leaflet_id); // Get the ids of deleted layers
//     console.log("Deleted IDs:", deletedIds); // For debugging
    
//     // Filter out polygons whose ids are not in the deletedIds array
//     setPolygons(prevPolygons => 
//       prevPolygons.filter(polygon => 
//         !deletedIds.includes(parseInt(polygon.id))
//       )
//     );
//   };

//   const _edited = (e: any) => {
//     // Do nothing
//     console.log("Edited called")


//     // // console.log("Polygons TEST -1:", polygons);

//     // let updatedPolygons = [...polygons]; // Start with a copy of the current polygons array

//     // e.layers.eachLayer((layer: any) => {
//     //   const editedId = layer._leaflet_id;
//     //   // console.log(`Type of ID: ${typeof(editedId)}`);
//     //   console.log(`Editing polygon with ID: ${editedId}`);
//     //   console.log("Polygons TEST 1:", polygons);
//     //   const editedPolygonIndex = updatedPolygons.findIndex(polygon => parseInt(polygon.id) === editedId);
//     //   console.log("Polygons TEST 2:", polygons);

//     //   if (editedPolygonIndex !== -1) {
//     //     const newCoordinates = layer.getLatLngs()[0];
//     //     console.log(`New coordinates for polygon ID ${editedId}:`, newCoordinates);
//     //     updatedPolygons[editedPolygonIndex].coordinates = newCoordinates;
//     //   } else {
//     //     console.warn(`No polygon found with ID: ${editedId}`);
//     //   }
//     // });
  
//     // // console.log("Updated polygons array after editing:", updatedPolygons);
//     // setPolygons(updatedPolygons); // Update state with the edited polygons
//   };
  

//   return (
//     <div>
//       <MapContainer 
//         center={default_coordinates} 
//         zoom={13} 
//         style={{ height: "650px", width: "100%" }}
//         whenCreated={setMap}
//       >
//         <TileLayer
//           url='https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png'
//           detectRetina={true}
//           minZoom={9}
//           maxZoom={23}
//           maxNativeZoom={18}
//           attribution='&copy; <img src="https://www.onemap.gov.sg/web-assets/images/logo/om_logo.png" style="height:20px;width:20px;"/>&nbsp;<a href="https://www.onemap.gov.sg/" target="_blank" rel="noopener noreferrer">OneMap</a>&nbsp;&copy;&nbsp;contributors&nbsp;&#124;&nbsp;<a href="https://www.sla.gov.sg/" target="_blank" rel="noopener noreferrer">Singapore Land Authority</a>'
//         />
//         <FeatureGroup>
//           <EditControl
//             position='topright'
//             onCreated={_created}
//             onDeleted={_deleted}
//             onEdited={_edited}
//             draw={{
//               polyline: false,
//               circlemarker: false,
//               rectangle: false,
//               circle: false,
//               marker: false,
//             }}
//           />
//           {polygons.map((polygon) => (
//             <Polygon 
//               key={polygon.id} 
//               positions={polygon.coordinates} 
//               // eventHandlers={{
//               //   add: (e) => {
//               //     _initialise(e, polygon)
//               //     console.log('event logged')
//               //   },
//               // }}
//             >
//               <Tooltip direction="bottom" offset={[0, 20]} opacity={1}>
//                 <div>
//                   <div><strong>Name:</strong> {polygon.name}</div>
//                   <div><strong>Address:</strong> {polygon.address}</div>
//                   <div><strong>Type:</strong> {polygon.type}</div>
//                 </div>
//               </Tooltip>
//               <Popup ref={popupElRef} closeButton={false}>
//                 <div className="flex flex-col space-y-4">
//                   <input type="text" placeholder="Name" ref={nameRef} defaultValue={polygon.name} className="p-2 border border-gray-300 rounded-md" />
//                   <input type="text" placeholder="Address" ref={addressRef} defaultValue={polygon.address} className="p-2 border border-gray-300 rounded-md" />
//                   <input type="text" placeholder="Type" ref={typeRef} defaultValue={polygon.type} className="p-2 border border-gray-300 rounded-md" />
//                   <button onClick={() => handleEdit(polygon.id)} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Save Changes</button>
//                 </div>
//               </Popup>
//             </Polygon>
//           ))}

//           {/* {polygons.map((polygon, index) => (
//             <Polygon key={index} positions={polygon.coordinates}>
//               <Tooltip direction="bottom" offset={[0, 20]} opacity={1}>
//                 <div>
//                   <div><strong>Name:</strong> {polygon.name}</div>
//                   <div><strong>Address:</strong> {polygon.address}</div>
//                   <div><strong>Type:</strong> {polygon.type}</div>
//                 </div>
//               </Tooltip>
//             </Polygon>
//           ))} */}
//         </FeatureGroup>
//         {showPopup && (
//           <Popup position={popupPosition}>
//             <div className="flex flex-col space-y-4">
//               <input type="text" placeholder="Name" ref={nameRef} className="p-2 border border-gray-300 rounded-md" />
//               <input type="text" placeholder="Address" ref={addressRef} className="p-2 border border-gray-300 rounded-md" />
//               <input type="text" placeholder="Type" ref={typeRef} className="p-2 border border-gray-300 rounded-md" />
//               <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Save</button>
//             </div>
//           </Popup>
        
//         )}
//       </MapContainer>
//     </div>
//   );
// };

// export default Map;

