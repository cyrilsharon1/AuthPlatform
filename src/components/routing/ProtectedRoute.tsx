import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
export function ProtectedRoute() {
  const { status } = useAppSelector((s) => s.auth);
  const location = useLocation();
  if (status === "checking")
    return (
      <div className="page-loader">
        <span className="loader-mark">cv</span>
        <p>Getting things ready…</p>
      </div>
    );
  return status === "authenticated" ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
}
