import './login.css'
import { useNavigate } from 'react-router-dom';
function Login(){

    const navigate=useNavigate()

    function loginFunc(name){
        sessionStorage.setItem("user", name);
        navigate("Lobby");
        //This function identifies the user who will enter the lobby. Instead of authentication.
    }
    return(
        <div id="login-container">
            <div id="welcome-title">Welcome to the class</div>
            <div id="identify-title">Who are you?</div>
            <div id="choose-container">
                <div className='pick1-box' onClick={()=>loginFunc("Tom")}>Tom</div>
                <div className='pick1-box' onClick={()=>loginFunc("Josh")}>Josh</div>
            </div>
        </div>
    )
}
export default Login;