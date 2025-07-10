import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="py-16 px-4 container mx-auto">
        <Routes>
          <Route path="/" element={<div>UPLOAD</div>} />
          <Route path="/login" element={<div>ACCOUNT</div>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
