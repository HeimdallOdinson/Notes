
import { useNavigate } from "react-router-dom";
import { useState } from "react";
function LogIn(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    let goTo = useNavigate();
    
    const sendLoginForm= async(event)=>{
        event.preventDefault();
        const logInData = {username: username, password: password}
        window.alert(String(await fetchLogin(logInData)))
        goTo("/")
    }

    async function fetchLogin(LoginData){
        return await fetch("http://localhost:8080/login",{
            method:"POST",
            headers:{
                "Content-Type":'application/json'
            },
            body:JSON.stringify(LoginData)
        })
        .then((response)=>{
            if(response.status===401)return "Unauthorized";
            return response.json();
        })
        .then((data)=>{

            localStorage.setItem("token",data.token);

            return "Log In Completed";
        })
        .catch(()=>{
            return "Error";
        })
    }
    return (
    
        <>
        <h1>Log In</h1>
      <form onSubmit={sendLoginForm}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(event)=> setUsername(event.target.value)}
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(event)=> setPassword(event.target.value)}
        />

        <button type="submit">Log In</button>
      </form>
        
        </>
    )
}
export default LogIn;