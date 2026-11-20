import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

// Verifies the current user's admin role on the server instead of trusting the browser.
export default function useAdminAuth() {
  const [state, setState] = useState({ checking: true, isAdmin: false, status: "checking", email: null });

  useEffect(() => {
    let active = true;
    base44.auth.me()
      .then((user) => {
        if (active) setState({ checking: false, isAdmin: user?.role === "admin", status: user?.role === "admin" ? "authorized" : "forbidden", email: user?.email || null });
      })
      .catch((error) => {
        const status = error?.status === 401 || error?.status === 403 ? "signed_out" : "error";
        if (active) setState({ checking: false, isAdmin: false, status, email: null });
      });
    return () => { active = false; };
  }, []);

  return state;
}