import type { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isLoggedIn = !!localStorage.getItem("userId");
  const location = useLocation();

  if (!isLoggedIn) {
    return (
      <Navigate
        to={`/auth?redirect=${encodeURIComponent(
          location.pathname + location.search
        )}`}
        replace
      />
    );
  }
  return children;
}
