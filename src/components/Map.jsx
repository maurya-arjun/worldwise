import React from "react";
import styles from "./Map.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
    useMapEvents,
} from "react-leaflet";
import { useState, useEffect } from "react";
import useCities from "../contexts/useCities";

function Map() {
    const { cities } = useCities();

    const [mapPosition, setMapPosition] = useState([40, 0]);

    const [searchParams] = useSearchParams();
    const mapLat = searchParams.get("lat");
    const mapLng = searchParams.get("lng");

    useEffect(() => {
        if (mapLat && mapLng)
            setMapPosition([parseFloat(mapLat), parseFloat(mapLng)]);
    }, [mapLat, mapLng]);

    return (
        <div className={styles.mapContainer}>
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
