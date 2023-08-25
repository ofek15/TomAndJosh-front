import './loby.css'
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HOST } from "../Utils/host"
function Lobby(){

  const navigate=useNavigate()

  const [allData,setAllData]=useState("")

  useEffect(() => {
      axios
        .get(`${HOST}/posts/fetchPosts`)
        .then(( {data} ) => {
          setAllData(data)
        })
        .catch((err) => console.log(err.message));
      //This function receives all the puzzles from the database, to display them in cubes.
  }, []);

    return(
    <div id="loby-container">
      <div className="goback-btn" onClick={()=>navigate("/")}>Back</div>
      <h1 id="tittle-loby">Choose one of the puzzles</h1>
      <div id="small-title-loby">And start improving yourself...</div>
      <div id="allPuzzle-box">
       <Link className='link-class1' to="../Codeblock/1"><div className='Puzzle-box'>{allData[0]?.title}</div></Link>
       <Link className='link-class1' to="../Codeblock/2"><div className='Puzzle-box'>{allData[1]?.title}</div></Link>
       <Link className='link-class1' to="../Codeblock/3"><div className='Puzzle-box'>{allData[2]?.title}</div></Link>
       <Link className='link-class1' to="../Codeblock/4"><div className='Puzzle-box'>{allData[3]?.title}</div></Link>
      </div>    
    </div>
    )
}
export default Lobby;