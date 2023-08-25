import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import "./codeblock.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
const socket = io.connect("http://localhost:5000");
import questions from "../questions.json";
import { HOST } from "../Utils/host";



function CodeBlock() {

  const files = {
    "puzzle1": {
      name: "script.js",
      language: "javascript",
      value: `function myFunction(a,b){
  
        return
      }`,
    },
    "puzzle2": {
      name: "script.js",
      language: "javascript",
      value: `function myFunction(a){
  
        return
      }`,
    },
    "puzzle3": {
      name: "script.js",
      language: "javascript",
      value: `function myFunction(array){
  
        return
      }`,
    },
    "puzzle4": {
      name: "script.js",
      language: "javascript",
      value: `function myFunction(array){
  
        return
      }`,
    }
  };

  //the files represent the start position of every puzzle

  const navigate = useNavigate();

  const storedUser = sessionStorage.getItem("user");

  const { id } = useParams();

function getKeyByOrder(obj, order) {
  const keysArray = Object.keys(obj);
  
  if (order >= 1 && order <= keysArray.length) {
    const keyAtIndex = keysArray[order - 1];
    return keyAtIndex;
  } else {
    return null;
  }
}
//function getKeyByOrder help bring the The correct default mode of the puzzle

const [fileName, setFileName] = useState(getKeyByOrder(files,id));
  const editorRef = useRef(null);
  const file = files[fileName];


  //We need the ID to link the users to the same room and also to display the relevant information of the puzzle.

  const [messageReceived, setMessageReceived] = useState("");

  const [succes,setSucces]=useState(false)

  

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    editor.onDidChangeModelContent(() => {
      const updatedContent = editor.getValue();
      setEditorContent(updatedContent);
    });
  }
  const [editorContent, setEditorContent] = useState(file.value);

  const [room, setRoom] = useState(id);

  //To make it easier, the room and ID of the puzzle are the same.
  // This is because each room has a specific puzzle, which belongs only to that room.

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  useEffect(() => {
    sendMessage();
  }, [editorContent]);

  //The useeffect listens to the editorContent, so that every change of the content will send a socket.

  const [dataOfPuzzle, setDataOfePuzzle] = useState();

  useEffect(() => {
    axios
      .get(`${HOST}/posts/fetchOnePost`, {
        params: { roomNumber: id },
      })
      .then(({ data }) => {
        setDataOfePuzzle(data);
        setRoom(id);
      })
      .catch((err) => console.log(err.message));
  }, []);

  useEffect(() => {
    joinRoom();
  }, [room]);

  const sendMessage = () => {
    socket.emit("send_message", { message: editorContent, room });
  };

  const SuccessPuzzle = ()=>{
    socket.emit("send_succes", { message: "yes", room });
    setSucces(true)
  }

  useEffect(() => {
    socket.on("recieve_message", (data) => {
      setMessageReceived(data.message);
    });
  }, [socket]);

  useEffect(()=>{
    socket.on("recieve_succes", (data) => {
      setSucces(true);
    });
  },[socket])

  const handleSubmit = () => {
    if (id == 3 || id==4){
      function arrayEquals(a, b) {
        return Array.isArray(a) &&
            Array.isArray(b) &&
            a.length === b.length &&
            a.every((val, index) => val === b[index]); //This part of the function concerns the examination of questions 3,4.
                                                      // It is not possible to compare arrays like a string, so a more complex comparison needs to be made
    }
      try{
        const userFunction = eval("(" + editorContent + ")"); // Create a new function using the user input
        for (const testCase of questions[id-1].testCases) {
          const ans = userFunction(...testCase.params);
          if (!arrayEquals(ans, testCase.answer)){
            return alert('Incorrect!')
          }
        }
        SuccessPuzzle()
        return alert('Correct!')
        
      }catch(err){
        alert("Incorrect!");
      }
    }
    try{
      const userFunction = eval("(" + editorContent + ")"); // Create a new function using the user input
      for (const testCase of questions[id-1].testCases) {
        const ans = userFunction(...testCase.params);
        if (ans !== testCase.answer){
          return alert('Incorrect!')
        }
      }
      SuccessPuzzle()
      return alert('Correct!')
      
    }catch(err){
      alert("Incorrect!");
    }
  };

  return (
    <div id="Codeblock-container">
      <div className="goback-btn" onClick={() => navigate("../Lobby")}>
        Back
      </div>
      <div id="title-solo-puzzle">{dataOfPuzzle?.title}</div>
      <div id="description-solo-puzzle">{dataOfPuzzle?.body}</div>

      {storedUser == "Josh" && (
        <>
          <div id="monaco-container">
            <Editor
              height="200px"
              width="70%"
              theme="vc"
              onMount={handleEditorDidMount}
              path={file.name}
              defaultLanguage={file.language}
              defaultValue={file.value}
            />
          </div>
          <button id="test-ans-btn" onClick={handleSubmit}>
            {" "}
            Submit
          </button>
        </>
      )}
      {storedUser == "Tom" && (
        <Editor
          height="400px"
          width="70%"
          theme="vc"
          defaultLanguage={file.language}
          defaultValue={file.value}
          value={messageReceived}
          options={{ readOnly: true }}
        ></Editor>
      )}
      
      <table id="table-case">
       <thead>
         <tr>
            <th>Test Case</th>
            <th>Answer</th>
        </tr>
       </thead>
       <tbody>
        {questions[id - 1].testCases.map((testCase, index) => (
            <tr key={index}>
                <td>{testCase.testCase}</td>
                <td>{testCase.answer.toString()}</td>
            </tr>
        ))}
       </tbody>
      </table>
      {succes&&
       <div id="smile-container" onClick={()=>{navigate("../Lobby")}}><img id="smile-icon" src="https://img.icons8.com/fluency/48/smiling.png" alt="smiling"/></div>
      }
    </div>
  );
}
export default CodeBlock;

