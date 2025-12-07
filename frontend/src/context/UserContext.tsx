import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext<any>(null);

export function UserProvider({ children }: any) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) return;

    fetch("http://127.0.0.1:8000/api/auth/me/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
