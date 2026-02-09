import { createBrowserRouter } from "react-router-dom";
import { adminRoutes } from "./admin";
import { userRoutes } from "./user";
import { authRoutes } from "./auth";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";

export const router = createBrowserRouter([
    { path: "/", Component: Home },
    authRoutes,
    userRoutes,
    adminRoutes,
    { path: "*", Component: NotFound }
])