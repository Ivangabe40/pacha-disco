import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

// Verifies the current user's admin role on the server instead of trusting the browser.
export default function useAdminAuth() {
  const [state, setState] = useState({ checking: true, isAdmin: false });

  useEffect(() => {
    let active = true;
    base44.auth.me()
      .then((user) => {
        if (active) setState({ checking: false, isAdmin: user?.role === "admin" });
      })
      .catch(() => {
        if (active) setState({ checking: false, isAdmin: false });
      });
    return () => { active = false; };
  }, []);

  return state;
}