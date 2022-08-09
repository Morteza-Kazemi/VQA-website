import './App.css';
import MainCard from './components/MainCard/MainCard'
import Navbar from "./components/Navbar/Navbar";

function App() {
  return (
    <div className="App">
        <Navbar/>

        <header>
          <MainCard/>
        </header>
    </div>
  );
}

export default App;
