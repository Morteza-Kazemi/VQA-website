import './App.css';
import UploadSection from './UploadSection'

function App() {
  return (
    <div className="App">
        <div className="App-navbar">
            visual qustion answering
        </div>

        <header className="App-body">
          <div className="upload-section">
              <UploadSection/>
              {/*<input type="file"/>*/}
          </div>

          <div className="answer-section">
              this is the answer
          </div>

        </header>
    </div>
  );
}

export default App;
