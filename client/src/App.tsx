import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import { useAuthStore } from "./store/useAuthStore";
import Header from "./components/Header/Header";

function App() {
  const email = useAuthStore((state) => state.email);
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
