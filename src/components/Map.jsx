import React from "react";
import styles from "./Map.module.css";
import { useNavigate } from "react-router-dom";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
    useMapEvents,
} from "react-leaflet";
import { useState, useEffect } from "react";
import useCities from "../hooks/useCities";
import { useGeoLocation } from "../hooks/useGeoLocation";
import Button from "./Button";
import { useUrlPosition } from "../hooks/useUrlPosition";

function Map() {
    const { cities } = useCities();
    const [mapPosition, setMapPosition] = useState([40, 0]);
    const {
        isLoading: isGeoLocationLoading,
        position: geoLocationPosition,
        handleGetPosition,
    } = useGeoLocation();

    const [mapLat, mapLng] = useUrlPosition();

    useEffect(() => {
        if (mapLat && mapLng)
            setMapPosition([parseFloat(mapLat), parseFloat(mapLng)]);
    }, [mapLat, mapLng]);

    useEffect(() => {
        if (geoLocationPosition)
            setMapPosition([geoLocationPosition.lat, geoLocationPosition.lng]);
    }, [geoLocationPosition]);

    return (
        <div className={styles.mapContainer}>
            <Button type="position" onClick={handleGetPosition}>
                {" "}
                {isGeoLocationLoading ? "Loading..." : "Use your position"}{" "}
            </Button>
            <MapContainer
                center={mapPosition}
                zoom={6}
                scrollWheelZoom={true}
                className={styles.map}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                />
                {cities.map((city) => (
                    <Marker
                        position={[city.position.lat, city.position.lng]}
                        key={city.id}
                    >
                        <Popup>
                            {city.emoji} {city.cityName}
                        </Popup>
                    </Marker>
                ))}
                <ChangeMapPosition position={mapPosition} />
                <DetectCityClick />
            </MapContainer>
        </div>
    );
}

function ChangeMapPosition({ position }) {
    const map = useMap();
    map.setView(position);
    return null;
}

function DetectCityClick() {
    const navigate = useNavigate();

    useMapEvents({
        click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
    });
}

export default Map;
