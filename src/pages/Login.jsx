import PageNav from "../components/PageNav";
import styles from "./Login.module.css";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Button from "../components/Button";

export default function Login() {
    // PRE-FILL FOR DEV PURPOSES
    const [email, setEmail] = useState("jack@example.com");
    const [password, setPassword] = useState("qwerty");

    const { login, isAuthenticated, error } = useAuth();
    const Navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        if (email && password) login(email, password);
    }

    useEffect(() => {
        if (isAuthenticated) Navigate("/app", { replace: true });
    }, [isAuthenticated, Navigate]);

    return (
        <main className={styles.login}>
            <PageNav />
            {error && <p>{error}</p>}
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.row}>
                    <label htmlFor="email">Email address</label>
                    <input
                        type="email"
                        id="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                </div>

                <div className={styles.row}>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                </div>

                <div>
                    <Button type="primary">Login</Button>
                </div>
            </form>
        </main>
    );
}
