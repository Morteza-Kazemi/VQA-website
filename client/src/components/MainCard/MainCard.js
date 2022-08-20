import axios from 'axios';
import React, {useEffect, useState} from 'react';
import './Main-card.css'
import './Modal.css'
import likeIcon from "../../icons/like-icon.png";
import Modal from 'react-modal';

const serverAddress = "http://localhost:5000";
const MODEL_RUNNING_TEXT = "running the model...";

const MainCard = () => {

    const [inputQuestion, setInputQuestion] = useState("");
    const [errorTxt, setErrorTxt] = useState("");
    const [answer, setAnswer] = useState("");
    const [selectedFile, setSelectedFile] = useState(null); // Initially, no file is selected
    const [timeToSend, setTimeToSend] = useState(false)

    //todo reset all variables for a new question and/or image correctly!
    const [liked, setLiked] = useState(null); // Initially, no like/dislike!
    const [userCorrection, setUserCorrection] = useState(""); // users correction of the answer


    const [modalIsOpen, setModalIsOpen] = useState(false);

    function openModal() {
        setLiked(null);
        setUserCorrection("");
        setModalIsOpen(true);
    }
    // function afterOpenModal() {subtitle.style.color = '#f00';}
    function closeModal() {
        setModalIsOpen(false);
        setTimeToSend(true);
    }

    useEffect(() => {
        if(timeToSend === true){
            //your code
            console.log('use effect of time to send ran and time to send is : ' + timeToSend.toString(), "liked: ", liked, "correction: ", userCorrection)
            const formData = new FormData();
            formData.append("image", selectedFile, selectedFile.name);
            formData.append("answer", answer);
            formData.append("question", inputQuestion);
            formData.append("liked", liked === null ? "" : liked.toString());
            formData.append("correction", userCorrection);
            axios.post(serverAddress+"/feedback", formData);
            setTimeToSend(false)
        }
    }, [timeToSend]);

    useEffect(() => {
        if(answer !== "" && answer !== MODEL_RUNNING_TEXT){
            //open the modal! because the answer is received from the server...
            openModal()
        }
    }, [answer]);


    const inside_modal = <>{
        liked===false ? (
            <>
                <h4>Thanks for your feedback!</h4>
                <div className="input-correction">
                    <input type="text"
                           placeholder="Please enter your suggested answer here!"
                           onChange={(event) => setUserCorrection(event.target.value)}
                    />
                    <button onClick={()=>closeModal()}>
                        submit
                    </button>
                </div>
            </>)
        : (
            <>
                <h4>Is "{answer}" a good answer?</h4>
                <div className="like-dislike">
                    <div className="button dislike-button" onClick={()=>setLiked(false)}>
                        <img src={likeIcon} alt="like"/>
                    </div>

                    <div className="button like-button" onClick={()=> {setUserCorrection("correct"); setLiked(true); closeModal();}}>
                        <img src={likeIcon} alt="like"/>
                    </div>
                </div>
            </>
        )
        }
        <button onClick={()=>{setUserCorrection(""); closeModal();}}>close</button>
    </>;

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
            <div className="answer-section">
                {answer}
            </div>

            <Modal className="modal-card"
                   isOpen={modalIsOpen}
                // onAfterOpen={afterOpenModal}
                // onRequestClose={closeModal} //esc or clicking somewhere
                // contentLabel="detail-card"
            >
                {inside_modal}

            </Modal>


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

        setAnswer(MODEL_RUNNING_TEXT);
        // Request made to the backend api //todo: http://online-vqa.herokuapp.com change the port back to 4000(http://localhost:5000) when working on your local machine!
        const response = await axios.post(serverAddress+"/upload-file", formData); // Send formData object //todo sometimes it is 5000, how about 4000? never?! this is so important!
        setAnswer(response.data.answer)
    }
};

// File content to be displayed after file upload is complete
const fileData = (selectedFile) => {
    if (selectedFile) {
        return (
            <div>
                <img src={URL.createObjectURL(selectedFile)} alt="alt text!"/>
            </div>
        );
    } else {
        return (<div/>);
    }
};


export default MainCard;