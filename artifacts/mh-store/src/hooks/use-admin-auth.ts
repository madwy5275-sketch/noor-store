import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export function useAdminAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("mh_admin_logged_in") === "true";
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const data = res.ok ? await res.json() : null;

        if (data?.loggedIn) {
          setIsLoggedIn(true);
          localStorage.setItem("mh_admin_logged_in", "true");
        } else {
          setIsLoggedIn(false);
          localStorage.removeItem("mh_admin_logged_in");
        }
      } catch {
        setIsLoggedIn(false);
        localStorage.removeItem("mh_admin_logged_in");
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {
    } finally {
      setIsLoggedIn(false);
      localStorage.removeItem("mh_admin_logged_in");
      setLocation("/seller/login");
    }
  };

  return { isLoggedIn, isLoading, logout };
}
