import { createBrowserRouter, RouterProvider } from "react-router-dom"

const router = createBrowserRouter([
    {
        path: "/",
        element: <h1>Work in progress</h1>,
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
