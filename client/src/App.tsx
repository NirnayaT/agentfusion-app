import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Register from "./pages/auth/register";
import Login from "./pages/auth/login";
import Dashboard from "./pages/dashboard/dashboard";

function App() {
  const router = createBrowserRouter([
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/",
      element: <Dashboard />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
