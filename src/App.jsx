import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChakraProvider } from '@chakra-ui/react'
import NavigationBar from './components/NavigationBar'
import Home from "./pages/Home"
import KaraokePlayer from "./pages/KaraokePlayer"



function App() {
  return (
    <ChakraProvider>
      <NavigationBar />
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/play" element={<KaraokePlayer />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
