import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"
import KaraokePlayer from "./pages/KaraokePlayer"



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/play" element={<KaraokePlayer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
