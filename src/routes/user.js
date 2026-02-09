import ProtectedLayout from "./ProtectedLayout";
import Home from "../pages/user/Home";

export const userRoutes = {
    path: "/user",
    Component: ProtectedLayout,
    children: [
        { path: "", Component: Home }
    ]
}
