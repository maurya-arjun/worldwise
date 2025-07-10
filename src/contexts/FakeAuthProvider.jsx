import { useReducer } from "react";
import AuthContext from "./FakeAuthContext";

const initialState = {
    user: null,
    isAuthenticated: false,
};

const FAKE_USER = {
    name: "Jack",
    email: "jack@example.com",
    password: "qwerty",
    avatar: "https://i.pravatar.cc/100?u=zz",
};

function reducer(state, action) {
    switch (action.type) {
        case "login":
            return { ...state, user: action.payload, isAuthenticated: true };
        case "logout":
            return { ...state, user: null, isAuthenticated: false };
        case "login/error":
            return { ...state, isAuthenticated: false, error: action.payload };
        default:
            throw new Error("Unknown Action Type.");
    }
}

function FakeAuthProvider({ children }) {
    const [{ user, isAuthenticated }, dispatch] = useReducer(
        reducer,
        initialState
    );

    function login(username, password) {
        if (username === FAKE_USER.email && password === FAKE_USER.password) {
            dispatch({ type: "login", payload: FAKE_USER });
        } else {
            dispatch({
                type: "login/error",
                payload: "Please enter correct username and password",
            });
        }
    }

    function logout() {
        dispatch({ type: "logout" });
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default FakeAuthProvider;
