import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import { refreshToken } from "./api/apiAuth";

import { useAuthStore } from "./store/useAuthStore";
import Header from "./components/Header/Header";

function App() {
  const token = useAuthStore((state) => state.accessToken);
  const email = useAuthStore((state) => state.email);
  const setToken = useAuthStore((state) => state.setToken);

  const handleTokenRefresh = async () => {
    try {
      const response = await refreshToken();
      setToken(response.data.accessToken);
    } catch (error: any) {
      console.error("Error", error.message);
    }
  };

  useEffect(() => {
    if (!token) {
      handleTokenRefresh();
    }
  }, []);

  return (
    <BrowserRouter>
      <Header />
      <main className="py-16 px-4 container mx-auto">
        <Routes>
          <Route path="/" element={<div>{email ? email : "NONE"}</div>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
