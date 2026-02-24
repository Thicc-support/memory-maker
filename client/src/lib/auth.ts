import { useState, useEffect, useCallback } from "react";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  createdAt: string | null;
}

let cachedUser: AuthUser | null = null;
let listeners: Array<(user: AuthUser | null) => void> = [];

function notify(user: AuthUser | null) {
  cachedUser = user;
  listeners.forEach(l => l(user));
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(cachedUser);
  const [loading, setLoading] = useState(cachedUser === null);

  useEffect(() => {
    listeners.push(setUser);
    return () => { listeners = listeners.filter(l => l !== setUser); };
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (res.ok) {
        const u = await res.json();
        notify(u);
      } else {
        notify(null);
      }
    } catch {
      notify(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Login failed");
    }
    const u = await res.json();
    notify(u);
    return u;
  };

  const register = async (email: string, name: string, password: string) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, password }),
      credentials: "include",
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Registration failed");
    }
    const u = await res.json();
    notify(u);
    return u;
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    notify(null);
  };

  return { user, loading, login, register, logout, refetch: fetchUser };
}
