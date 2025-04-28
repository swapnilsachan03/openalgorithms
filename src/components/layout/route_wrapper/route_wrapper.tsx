import React from "react";
import { Navigate } from "react-router-dom";

import { useIsLoggedIn, useIsAdmin } from "@/stores/userStore";

interface RouteWrapperProps {
  children: React.ReactNode;
  isAuthRoute?: boolean;
  isAdminRoute?: boolean;
  isProtectedRoute?: boolean;
}

const RouteWrapper = (props: RouteWrapperProps) => {
  const {
    children,
    isAuthRoute = false,
    isAdminRoute = false,
    isProtectedRoute = false,
  } = props;

  const isLoggedIn = useIsLoggedIn();
  const isAdmin = useIsAdmin();

  if (isAuthRoute && isLoggedIn) return <Navigate to="/" replace />;
  if (isAdminRoute && !isAdmin) return <Navigate to="/" replace />;
  if (isProtectedRoute && !isLoggedIn) return <Navigate to="/login" replace />;

  return children;
};

export default RouteWrapper;
