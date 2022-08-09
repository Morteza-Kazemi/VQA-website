import axios from 'axios';
import React, {useState} from 'react';
import './Main-card.css'

const MainCard = () => {

    const [selectedFile, setSelectedFile] = useState(null); // Initially, no file is selected
    const [inputQuestion, setInputQuestion] = useState("");
    const [errorTxt, setErrorTxt] = useState("");
    const [answer, setAnswer] = useState("");

    let answer_section = <div className="answer-section">
        {answer}
    </div>;

    return (
        <div className="App-body">
            <div className="main-card">
                <input className="file-input" type="file" onChange={(event) => setSelectedFile(event.target.files[0])}/>
                {fileData(selectedFile)}
                <input className="question-input" type="text" placeholder="Enter your question here!"
                       onChange={(event) => setInputQuestion(event.target.value)}
                />

                <button className="upload-button"
                        onClick={() => onFileUpload(setErrorTxt, setAnswer, selectedFile, inputQuestion)}>
                    Upload!
                </button>
                <div className="error-text">{errorTxt}</div>

            </div>

            {/*todo this is sooo wrong! everything about it! change it asap*/}
            {answer_section}
        </div>
    );

}


const onFileUpload = async (setErrorTxt, setAnswer, selectedFile, inputQuestion) => { // On file upload (click the upload button)
    setAnswer("")
    if (selectedFile == null) {
        setErrorTxt("select an image!");
    } else if (inputQuestion === "") {
        setErrorTxt("type a question!");
    } else {
        setErrorTxt("");

    // Create an object of formData
    const formData = new FormData();
    // Update the formData object
    // todo this function should convert the extension of the files to png! only png!
    formData.append("image", selectedFile, selectedFile.name);
    formData.append("question", inputQuestion);

    setAnswer("running the model...");
    // Request made to the backend api
    const response = await axios.post("http://localhost:4000/upload-file", formData); // Send formData object
    setAnswer(response.data.answer)
    }
};

// File content to be displayed after file upload is complete
const fileData = (selectedFile) => {
    if (selectedFile) {
        return (
            <div>
                <img src={URL.createObjectURL(selectedFile)} alt="alt text!"/>
                {/*<p>File Type: {this.state.selectedFile.type}</p>*/}
            </div>
        );
    } else {
        return (<div/>);
    }
};


export default MainCard;
