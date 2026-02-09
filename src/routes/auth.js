import AuthLayout from "./AuthLayout";
import Login from "../pages/auth/Login";

export const authRoutes = {
    path: "/",
    Component: AuthLayout,
    children: [
        { path: "login", Component: Login }
    ]
}
