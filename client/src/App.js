import './App.css';
import MainCard from './components/MainCard/MainCard'
import Navbar from "./components/Navbar/Navbar";
import ImagesPage from "./components/ImagesPage/ImagesPage";
import {BrowserRouter, Route, Routes} from "react-router-dom";

function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={
                  <div className="App">
                      <Navbar/>

                      <header>
                          <MainCard/>
                      </header>
                  </div>
              }/>
              <Route path="/history" element={
                  <div className="App">
                      <ImagesPage/>
                  </div>
              }/>
          </Routes>

      </BrowserRouter>
  );
}

export default App;
