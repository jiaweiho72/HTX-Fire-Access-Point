'use client';

import React, { useState, useEffect, useRef } from "react";
import L, { LatLng } from 'leaflet';
import { MapContainer, TileLayer, Tooltip, Popup, Polygon, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import 'leaflet-draw/dist/leaflet.draw.css';
import { IconButton, Snackbar, SnackbarContent } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { createPolygon, getPolygons, updatePolygon, deletePolygon } from "../services/api";
import { CreatePolygonData, UpdatePolygonData, PolygonData } from "../../app/types";
import ErrorMessage from './ErrorMesssage';

// Notes
// Leaflet ID is to track/interact with the drawings in leafletJS. The other ID is for the database.

// Variable constants
const mapUrl = 'https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png';
const default_coordinates: L.LatLng = L.latLng(1.2949332, 103.7931717);

// Formatting icons
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});

// Map Component
const Map: React.FC = () => {
  const [polygons, setPolygons] = useState<PolygonData[]>([]);
  const [popupPosition, setPopupPosition] = useState<LatLng>(default_coordinates);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const [currentPolygonLeafletId, setCurrentPolygonLeafletId] = useState<string>("null");

  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [type, setType] = useState<string>("");

  const popupElRef = useRef<L.Popup | null>(null);
  const polygonRef = useRef<L.Polygon | null>(null);

  const [tooltipOpened, setTooltipOpened] = useState<boolean>(true);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAttempted = useRef(false);


  // Initial database fetching of saved polygons from backend
  useEffect(() => {
    const fetchPolygons = async () => {
      if (fetchAttempted.current) {
        return; // Prevent fetching data again
      }
      fetchAttempted.current = true; // Set flag to true to prevent re-fetching
  
      try {
        setLoading(true);
        const data = await getPolygons();
        setPolygons(data as PolygonData[]);
        console.log('fetching polygon database')
      } catch (err) {
        setError('Failed to load polygons from database');
      } finally {
        setLoading(false);
      }
    };
    fetchPolygons();
  }, []);

  // For development - to check state of polygons list
  useEffect(() => {
    console.log("Updated list of Polygons:", polygons);
  }, [polygons]);

  // ---------------------- Helper functions ------------------------------
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const closePopup = () => {
    if (popupElRef.current) {
      popupElRef.current.close();
    }
  }

  // Save edit of polygon details
  const handleEdit = (polygonLeafletId: string) => {
    setPolygons(polygons.map(polygon => {
      if (polygon.leafletID === polygonLeafletId) {
        const updatedPolygon = { ...polygon, name, address, type };
        handleUpdatePolygon(updatedPolygon);
        return updatedPolygon;
      }
      return polygon;
    }));
    closePopup();
    setCurrentPolygonLeafletId("null"); // Reset current polygon leafletID
    setSnackbarOpen(true); // Success message
    console.log("Polygon edited:", polygonLeafletId);
  };

  // Save edit for NEWLY CREATED polygon details
  const handleSave = () => {
    setPolygons(polygons.map(polygon => {
      if (polygon.leafletID === currentPolygonLeafletId) {
        const updatedPolygon = { ...polygon, name, address, type };
        handleUpdatePolygon(updatedPolygon); // Consider returning the response object instead
        return updatedPolygon;
      }
      return polygon;
    }));
    setShowPopup(false); // Only difference from handleEdit -> Because they are different popups
    setCurrentPolygonLeafletId("null");
    setSnackbarOpen(true);
    console.log("Polygon saved:", currentPolygonLeafletId);
  };

  // ---------------------- Handle API Calls ------------------------------
  const handleUpdatePolygon = async (polygon: UpdatePolygonData) => {
    try {
      const updatedPolygon: UpdatePolygonData = await updatePolygon(polygon);
      console.log("Updated Polygon:", updatedPolygon);
    } catch (error) {
      console.error("Error updating polygon:", error);
    }
  };

  const handleCreatePolygon = async (latlngs: LatLng[]) => {
    const data: CreatePolygonData = {
      name: "",
      address: "",
      type: "",
      coordinates: latlngs,
    };
    try {
      const response = await createPolygon(data);
      const polygonData: UpdatePolygonData = {
        ...response,
        id: response.id.toString(), // Conver id number to string
      };
      console.log('Polygon created:', polygonData);
      return polygonData;
    } catch (error) {
      console.error('Error creating polygon:', error);
      return;
    }
  };

  const handleDeletePolygon = async (polygonID: number) => {
    try {
      await deletePolygon(polygonID); // Delete has no response body/payload
      console.log("Polygon Deleted:", polygonID);
    } catch (error) {
      console.error("Error deleting polygon:", error);
    }
  };

  // ---------------------- Event-based functions ------------------------------
  // On creation of new polygon using drawing tool
  const _created = async (e: any) => {
    const latlngs = e.layer.getLatLngs()[0];
    const leafletID = e.layer._leaflet_id.toString();
    setPopupPosition(latlngs[0]);
    setCurrentPolygonLeafletId(leafletID); // Set current polygon leafletID
    setShowPopup(true); // Show the popup when a polygon is created
    // Reset form fields
    setName("");
    setAddress("");
    setType("");

    const result = await handleCreatePolygon(latlngs);

    const newPolygon: PolygonData = {
      id: result?.id ?? "", // ID generated in the database is in the response payload
      leafletID,
      name: "",
      address: "",
      type: "",
      coordinates: latlngs,
    };
    setPolygons(prevPolygons => [...prevPolygons, newPolygon]); // Add new polygon to polygons
    e.layer.remove() // Remove drawn layer from overlapping layer
  };

  // On addition of new polygon to polygons list, Initialise polygon's leafletID
  const _initialise = (e: any, polygon: PolygonData) => {
    if (!e || !polygon) {
      console.error("Invalid event or polygon data:", { e, polygon });
    }
    const leafletID = e.target?._leaflet_id?.toString();
    if (!leafletID) {
      console.error("Invalid layer or layer leafletID:", e);
    }
    // Initialise the newly created polygon object with the correct leafletID
    setPolygons(prevPolygons =>
      prevPolygons.map(p => {
        // Update leafletID if the polygon id matches current polygon
        if (p.id === polygon.id) {
          // Set currentPolygonLeafletId if p.id matches currentPolygonLeafletId
          // This is for the case where a polygon is assigned a new leaflet_id. 
          // Update the currentPolygonLeafletId with the new leaflet id of the polygon
          if (p.leafletID === currentPolygonLeafletId) {
            setCurrentPolygonLeafletId(leafletID);
          }
          return { ...p, leafletID };
        } else {
          return p;
        }
      })
    );
  };

  const _deleted = async (e: any) => {
    const deletedLeafletIds = e.layers.getLayers().map((layer: any) => layer._leaflet_id); // Get the ids of deleted layers
    setPolygons(prevPolygons => {
      const updatedPolygons = prevPolygons.filter(polygon => {
        if (deletedLeafletIds.includes(parseInt(polygon.leafletID))) {
          handleDeletePolygon(parseInt(polygon.id));
          return false; // Exclude this polygon from the updatedPolygons array
        }
        return true; // Include this polygon in the updatedPolygons array
      });

      setSnackbarOpen(true); // Open snackbar after processing
      return updatedPolygons;
    });
  };
  

  // On editing of polygons using drawing control tool
  const _edited = (e: any) => {
    const layers = e.layers._layers;
    // For each layer edited
    for (const id in layers) {
      if (layers.hasOwnProperty(id)) {
        const layer = layers[id];
        if (layer instanceof L.Polygon) {
          updatePolygonCoordinates(layer);
        }
      }
    }
    setSnackbarOpen(true);
  };


  // Update polygon with new coordinates in the polygons list
  const updatePolygonCoordinates = (layer: L.Polygon) => {
    const updatedLeafletID = (layer as any)._leaflet_id.toString(); // Using any as L.Polygon type does not officially define _leaflet_id as a property
    const newCoordinates = layer.getLatLngs() as L.LatLng[][]; // Explicitly typing as LatLng[][]
    setPolygons((prevPolygons) => {
      const updatedPolygons = prevPolygons.map((polygon) => {
        if (polygon.leafletID === updatedLeafletID) {
          // const coordinates = newCoordinates[0]
          handleUpdatePolygon({...polygon, coordinates: newCoordinates[0]})
          console.log(`Updating Polygon with ID: ${polygon.leafletID}`);
          return {
            ...polygon,
            coordinates: newCoordinates[0], 
          };
        } else {
          return polygon;
        }
      });
      return updatedPolygons;
    });
  };

  const openPopupForPolygon = (polygon: PolygonData) => {
    setCurrentPolygonLeafletId(polygon.leafletID);
    // Prefill form fields
    setName(polygon.name);
    setAddress(polygon.address);
    setType(polygon.type);
  };
  
  if (loading) {
    return <div>Loading...</div>;
  } else if (error) {
    return <div>{error && <ErrorMessage message={error} />}</div>;
  }
  return (
    <div>
      {/* Map component */}
      <div style={{ width: '100%', height: '100%', backgroundColor: '#f0f0f0' }}>
        <MapContainer 
          center={default_coordinates} 
          zoom={13} 
          style={{ height: "640px", width: "100%" }}
        >
          <TileLayer
            url={mapUrl} // Use current map URL based on index
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
              onDeleted={_deleted}
              onEdited={_edited}
              onDrawStart={closePopup}
              onEditStart={closePopup}
              onDeleteStart={closePopup}
              draw={{
                polyline: false,
                circlemarker: false,
                rectangle: false,
                circle: false,
                marker: false,
              }}
            />
            {polygons.map((polygon) => (
              <Polygon 
                key={polygon.id} 
                positions={polygon.coordinates}
                ref={(el) => { 
                  if (el && polygon.leafletID === currentPolygonLeafletId) { 
                    polygonRef.current = el;
                  } 
                }} 
                eventHandlers={{
                  click: () => {
                    openPopupForPolygon(polygon);
                  },
                  add: (e) => {
                    _initialise(e, polygon);
                  }, 
                  popupopen: () => {
                    setTooltipOpened(false); // Close tooltip when popup opens
                  },
                  popupclose: () => {
                    setTooltipOpened(true);
                  }
                }}
              >
                {typeof tooltipOpened === 'boolean' && tooltipOpened && (
                  // Render custom Tooltip when tooltipOpened is true
                  <Tooltip 
                    direction="bottom" 
                    offset={[0, 20]} 
                    opacity={1}
                  >
                    <div>
                      <div><strong>Name:</strong> {polygon?.name}</div>
                      <div><strong>Address:</strong> {polygon?.address}</div>
                      <div><strong>Type:</strong> {polygon?.type}</div>
                    </div>
                  </Tooltip>
                )}

                <Popup 
                  ref={(el) => { 
                    if (el && polygon.leafletID === currentPolygonLeafletId) { 
                      popupElRef.current = el;
                    } 
                  }} 
                  closeButton={false}
                >
                  <div 
                    className="flex flex-col space-y-4"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleEdit(polygon.leafletID); // Call handleEdit when Computer's Enter button is pressed
                      }
                    }}
                    tabIndex={0} // Ensure the div is focusable to capture key events
                  >
                    <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="p-2 border border-gray-300 rounded-md" />
                    <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="p-2 border border-gray-300 rounded-md" />
                    <input type="text" placeholder="Type" value={type} onChange={(e) => setType(e.target.value)} className="p-2 border border-gray-300 rounded-md" />
                    <button onClick={() => handleEdit(polygon.leafletID)} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Save Changes</button>
                  </div>
                </Popup>
              </Polygon>
            ))}
          </FeatureGroup>
          {showPopup && (
            <Popup position={popupPosition} closeButton={false}>
              <div 
                className="flex flex-col space-y-4"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSave(); // Call handleSave when Enter is pressed
                  }
                }}
                tabIndex={0} // Ensure the div is focusable to capture key events
              >
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="p-2 border border-gray-300 rounded-md" />
                <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="p-2 border border-gray-300 rounded-md" />
                <input type="text" placeholder="Type" value={type} onChange={(e) => setType(e.target.value)} className="p-2 border border-gray-300 rounded-md" />
                <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Save</button>
              </div>
            </Popup>
          )}
        </MapContainer>
      </div>
      {/* Customized Snackbar */}
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
      >
        <SnackbarContent
          // style={{
          //   backgroundColor: '#4caf50',
          // }}
          message={
            <span id="client-snackbar" style={{ display: 'flex', alignItems: 'center' }}>
              Changes saved successfully
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="close"
              color="inherit"
              onClick={handleSnackbarClose}
            >
              <CloseIcon />
            </IconButton>
          ]}
        />
      </Snackbar>
    </div>
  );
};

export default Map;