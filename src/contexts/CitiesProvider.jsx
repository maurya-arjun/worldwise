import { useEffect, useState } from "react";
import CitiesContext from "./CitiesContext";

const BASE_URL = "http://localhost:3001";

function CitiesProvider({ children }) {
    const [cities, setCities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentCity, setCurrentCity] = useState({});

    useEffect(function () {
        const fetchCities = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${BASE_URL}/cities`);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setCities(data);
            } catch (error) {
                console.error("Failed to fetch cities:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCities();
    }, []);

    async function fetchCitiesById(id) {
        setIsLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/cities/${id}`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setCurrentCity(data);
        } catch (error) {
            console.error("Failed to fetch city by ID:", error);
        } finally {
            setIsLoading(false);
        }
    }

    async function createCity(newCity) {
        setIsLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/cities`, {
                method: "POST",
                body: JSON.stringify(newCity),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setCities((cities) => [...cities, data]);
        } catch (error) {
            console.error("Failed to creating city:", error);
        } finally {
            setIsLoading(false);
        }
    }

    async function deleteCity(id) {
        setIsLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/cities/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            setCities((cities) => cities.filter((city) => city.id !== id));
        } catch (error) {
            console.error("Failed to deleting city by ID:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <CitiesContext.Provider
            value={{
                cities,
                isLoading,
                currentCity,
                fetchCitiesById,
                createCity,
                deleteCity,
            }}
        >
            {children}
        </CitiesContext.Provider>
    );
}

export default CitiesProvider;
