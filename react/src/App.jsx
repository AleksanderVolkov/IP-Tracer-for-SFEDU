import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Main from "./pages/main/Main";
import { useEffect } from "react";

// Связка страниц
export default function App() {
  const getHistory = () => {

  }
  useEffect(() => {
    getHistory()
  }, [])
  return (
    <Router>
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="/main/Main" element={<Main />} />
      </Routes>
    </Router>
  );
}
