import './App.css';
import MainCard from './components/MainCard/MainCard'
import Navbar from "./components/Navbar/Navbar";

function App() {
  return (
    <div className="App">
        <Navbar/>

        <header className="App-body">
          <MainCard/>

          <div className="answer-section">
              this is the answer
          </div>

        </header>
    </div>
  );
}

export default App;
