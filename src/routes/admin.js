import ProtectedLayout from "./ProtectedLayout";
import Dashboard from "@/pages/admin/Dashboard";
import Users from "@/pages/admin/Users";
import Post from "@/pages/admin/Post";


export const adminRoutes = {
    path: "/admin",
    Component: ProtectedLayout,
    children: [
        { path: "", Component: Dashboard },
        { path: "users", Component: Users },
        { path: "posts", Component: Post }  
    ]
}
