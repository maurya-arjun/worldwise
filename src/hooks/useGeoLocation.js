import { useState } from "react";

export function useGeoLocation(defaultPosition = null) {
    const [position, setPosition] = useState(defaultPosition);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    function handleGetPosition() {
        if (!navigator.geolocation)
            return setError("Your browser is not supporting geo location.");

        setIsLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setPosition({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                });
                setIsLoading(false);
            },
            (error) => {
                console.log(error);
                setError(error.message);
                setIsLoading(false);
            }
        );
    }
    return { isLoading, error, position, handleGetPosition };
}
