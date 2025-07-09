import { useEffect, useReducer } from "react";
import CitiesContext from "./CitiesContext";

const BASE_URL = "http://localhost:3001";

function CitiesProvider({ children }) {
    const initialState = {
        cities: [],
        isLoading: false,
        currentCity: {},
        error: "",
    };

    function reducer(state, action) {
        switch (action.type) {
            case "loading":
                return { ...state, isLoading: true };

            case "cities/loaded":
                return { ...state, isLoading: false, cities: action.payload };

            case "city/loaded":
                return {
                    ...state,
                    isLoading: false,
                    currentCity: action.payload,
                };

            case "city/created":
                return {
                    ...state,
                    isLoading: false,
                    cities: [...state.cities, action.payload],
                    currentCity: action.payload,
                };

            case "city/deleted":
                return {
                    ...state,
                    isLoading: false,
                    cities: state.cities.filter(
                        (city) => city.id !== action.payload
                    ),
                    currentCity: {},
                };

            case "rejected":
                return { ...state, isLoading: false, error: action.payload };

            default:
                throw new Error("Unknow action type");
        }
    }

    const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
        reducer,
        initialState
    );

    useEffect(function () {
        const fetchCities = async () => {
            dispatch({ type: "loading" });
            try {
                const response = await fetch(`${BASE_URL}/cities`);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();

                dispatch({ type: "cities/loaded", payload: data });
            } catch (err) {
                dispatch({
                    type: "rejected",
                    payload: `Failed to fetch cities ${err.message || err}`,
                });
            }
        };

        fetchCities();
    }, []);

    async function fetchCitiesById(id) {
        if (id === currentCity.id) return;

        dispatch({ type: "loading" });
        try {
            const response = await fetch(`${BASE_URL}/cities/${id}`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            dispatch({ type: "city/loaded", payload: data });
        } catch (err) {
            dispatch({
                type: "rejected",
                payload: `Failed to fetch city by ID: ${err.message || err}`,
            });
        }
    }

    async function createCity(newCity) {
        dispatch({ type: "loading" });
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
            dispatch({ type: "city/created", payload: data });
        } catch (err) {
            dispatch({
                type: "rejected",
                payload: `Failed to create a new CITY: ${err.message || err}`,
            });
        }
    }

    async function deleteCity(id) {
        dispatch({ type: "loading" });
        try {
            const response = await fetch(`${BASE_URL}/cities/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            dispatch({ type: "city/deleted", payload: id });
        } catch (err) {
            dispatch({
                type: "rejected",
                payload: `Failed to delete city by ID: ${err.message || err}`,
            });
        }
    }

    return (
        <CitiesContext.Provider
            value={{
                cities,
                isLoading,
                currentCity,
                error,
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
