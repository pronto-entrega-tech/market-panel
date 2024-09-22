import { useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const useGoBack = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(
    () => navigate(location.pathname.split("/").slice(0, -1).join("/")),
    [location.pathname, navigate],
  );
};
