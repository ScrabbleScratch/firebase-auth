import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../utils/firebase";
import Home from "./Home";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import PasswordReset from "./PasswordReset";
import Portal from "./Portal";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/signin",
        element: <SignIn />,
    },
    {
        path: "/signup",
        element: <SignUp />,
    },
    {
        path: "/reset",
        element: <PasswordReset />,
    },
    {
        path: "/portal",
        element: <Portal />,
    },
]);

function App() {
    useEffect(() => {
        onAuthStateChanged(auth, user => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                const uid = user.uid;
                console.log("User authenticated with UID:", uid);
            } else {
                // User is signed out
                console.log("User signed out");
            }
        });
    }, []);

    return <RouterProvider router={router} />;
}

export default App;
