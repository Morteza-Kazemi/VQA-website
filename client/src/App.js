import './App.css';
import MainCard from './components/MainCard/MainCard'
import Navbar from "./components/Navbar/Navbar";
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
          </Routes>

      </BrowserRouter>
  );
}

export default App;
