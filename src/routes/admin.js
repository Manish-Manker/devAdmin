import ProtectedLayout from "./ProtectedLayout";
import Dashboard from "@/pages/admin/Dashboard";
import Users from "@/pages/admin/Users";
import Post from "@/pages/admin/Post";
import ReportPost from "@/pages/admin/ReportPost";
import Contactus from "@/pages/admin/Contactus";
import AccountDeletion from "@/pages/admin/AccountDeletion";
import WaitingList from "@/pages/admin/waitingList";
import Settings from "@/pages/admin/Settings";


export const adminRoutes = {
    path: "/admin",
    Component: ProtectedLayout,
    children: [
        { path: "", Component: Dashboard },
        { path: "users", Component: Users },
        { path: "posts", Component: Post },
        { path: "reportpost", Component: ReportPost },
        { path: "contactus", Component: Contactus },
        { path: "accountdeletion", Component: AccountDeletion },
        { path: "waitinglist", Component: WaitingList },
        { path: "settings", Component: Settings }
    ]
}
