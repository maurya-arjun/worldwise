import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Message from "./Message";
import Spinner from "./Spinner";
import useCities from "../hooks/useCities";
import { useNavigate } from "react-router-dom";
import { convertToEmoji } from "../utils";

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
    const [lat, lng] = useUrlPosition();
    const [cityName, setCityName] = useState("");
    const [country, setCountry] = useState("");
    const [date, setDate] = useState(new Date());
    const [notes, setNotes] = useState("");
    const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
    const [emoji, setEmoji] = useState("");
    const [geocodingError, setGeocodingError] = useState("");
    const { createCity, isLoading } = useCities();
    const Navigate = useNavigate();

    useEffect(() => {
        if (!lat && !lng) return;

        async function fetchCityData() {
            setIsLoadingGeocoding(true);
            setGeocodingError("");
            try {
                const res = await fetch(
                    `${BASE_URL}?latitude=${lat}&longitude=${lng}`
                );
                if (!res.ok) {
                    throw new Error("Failed to fetch city data");
                }

                const data = await res.json();

                if (!data.countryCode) {
                    throw new Error(
                        "That don't look like a valid position, Click somewhere on the map to get a valid position. 😊"
                    );
                }

                setIsLoadingGeocoding(false);
                setCityName(data.city || data.locality || "");
                setCountry(data.countryName);
                setEmoji(convertToEmoji(data.countryCode));
            } catch (error) {
                setGeocodingError(error.message);
            } finally {
                setIsLoadingGeocoding(false);
            }
        }

        fetchCityData();
    }, [lat, lng]);

    async function handleSubmit(e) {
        e.preventDefault();

        if (!cityName || !date) return;

        const newCity = {
            cityName,
            country,
            emoji,
            date,
            notes,
            position: {
                lat,
                lng,
            },
        };

        await createCity(newCity);
        Navigate("/app/cities");
    }

    if (isLoadingGeocoding) return <Spinner />;

    if (!lat && !lng)
        return <Message message="Please click somewhere in map" />;

    if (geocodingError) return <Message message={geocodingError} />;

    return (
        <form
            className={`${styles.form} ${isLoading ? styles.loading : ""}`}
            onSubmit={handleSubmit}
        >
            <div className={styles.row}>
                <label htmlFor="cityName">City name</label>
                <input
                    id="cityName"
                    onChange={(e) => setCityName(e.target.value)}
                    value={cityName}
                />
                <span className={styles.flag}>{emoji}</span>
            </div>

            <div className={styles.row}>
                <label htmlFor="date">When did you go to {cityName}?</label>
                <DatePicker
                    id="date"
                    selected={date}
                    onChange={(date) => setDate(date)}
                />
            </div>

            <div className={styles.row}>
                <label htmlFor="notes">
                    Notes about your trip to {cityName}
                </label>
                <textarea
                    id="notes"
                    onChange={(e) => setNotes(e.target.value)}
                    value={notes}
                />
            </div>

            <div className={styles.buttons}>
                <Button type="primary">Add</Button>
                <BackButton />
            </div>
        </form>
    );
}

export default Form;
