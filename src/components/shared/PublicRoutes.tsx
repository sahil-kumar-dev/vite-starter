import useAuthStore from "@/store/useAuthStore";
import { Navigate } from "react-router-dom";

export default function PublicRoutes({ children }: { children: React.ReactNode }) {

    const { user } = useAuthStore();

    if (user) {
        return <Navigate to="/" />;
    }

    return <>{children}</>
}
