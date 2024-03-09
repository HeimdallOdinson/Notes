import { useState } from "react";
function SignUp(){
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const sendSignUpForm= async(event)=>{
        event.preventDefault();
        const signUpInfo = {username: username, password: password}
        window.alert(String(await fetchSingUp(signUpInfo)))
    }

    async function fetchSingUp(signUpInfo){
        return await fetch("http://localhost:8080/signup",{
            method:"POST",
            headers:{
                "Content-Type":'application/json'
            },
            body:JSON.stringify(signUpInfo)
        })
        .then((response)=>{
            
            if(response.status===409)return "User with the given username already exists";
            if(response.status===400)return "Unauthorized";
            if(response.status===200)return "User registration successful";
        })
        .catch(()=>{
            return "Error";
        })
    }
    {/*AQUI SE ESCRIBE EL JAVASCRIPTS QUE DEVUELVE EL COMPONENTE*/}
    return (
        
        <>
        <h1>Create Your Account</h1>
      <form onSubmit={sendSignUpForm}>
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

        <button type="submit">Sign Up</button>
      </form>
        </>
    )
}
export default SignUp;