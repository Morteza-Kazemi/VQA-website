import axios from 'axios';
import React, {useState} from 'react';
import './Main-card.css'

const MainCard = () => {

    const [selectedFile, setSelectedFile] = useState(null); // Initially, no file is selected
    const [inputQuestion, setInputQuestion] = useState("");
    const [errorTxt, setErrorTxt] = useState("");

    return (
        <div className="main-card">
            <input className="file-input" type="file" onChange={(event) => setSelectedFile(event.target.files[0])} />
            {fileData(selectedFile)}
            <input className="question-input" type="text" placeholder="Enter your question here!"
                   onChange={ (event)=> setInputQuestion(event.target.value) }
            />

            <button className="upload-button" onClick={() => onFileUpload(setErrorTxt, selectedFile, inputQuestion)}>
                Upload!
            </button>
            <div className="error-text">{errorTxt}</div>

        </div>
    );

}


const onFileUpload = (setErrorTxt, selectedFile, inputQuestion) => { // On file upload (click the upload button)
    if(selectedFile == null){
        setErrorTxt("select an image!");
    }
    else if(inputQuestion === ""){
        setErrorTxt("type a question!");
    }
    else {
        setErrorTxt("");

        // Create an object of formData
        const formData = new FormData();
        // Update the formData object
        formData.append("myFile", selectedFile, selectedFile.name);

        // Request made to the backend api
        // axios.post("api/uploadfile", formData); // Send formData object
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
