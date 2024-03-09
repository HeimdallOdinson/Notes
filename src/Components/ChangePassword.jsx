import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkToken } from "../Methods";
function ChangePassword(){
    const [oldPassword, setoldPassword] = useState('');
    const [newPassword, setPassword] = useState('');
    let goTo = useNavigate();
    const sendChangePasswordForm= async(event)=>{
        event.preventDefault();
        const passwordsData = {oldPassword: oldPassword, newPassword: newPassword}
        window.alert(String(await fetchChangePassword(passwordsData)));
        
    }

    useEffect(() => {
        if(!checkToken()){
            window.alert("You must login before entering the settings")
            goTo("/login");
        }
  
    }, [goTo,])
  

    async function fetchChangePassword(passwordsData){
        return await fetch("http://localhost:8080/changepassword",{
            method:"POST",
            headers:{
                "Content-Type":'application/json',
                "Authorization": "Bearer "+localStorage.getItem("token")
            },
            body:JSON.stringify(passwordsData)
        })
        .then((response)=>{
            if(response.status===401)return "Unauthorized";
            if(response.status===200){
                goTo("/")
                return "Password changed succesfully";
            }

        })
         
        .catch(()=>{
            return "Error";
        })
    }
    return (
        <>
            <h1>Change Password</h1>
            <form onSubmit={sendChangePasswordForm}>
        <label htmlFor="oldPassword">Old Password:</label>
        <input
          type="text"
          id="oldPassword"
          value={oldPassword}
          onChange={(event)=> setoldPassword(event.target.value)}
        />

        <label htmlFor="New Password"> New Password:</label>
        <input
          type="password"
          id="password"
          value={newPassword}
          onChange={(event)=> setPassword(event.target.value)}
        />

        <button type="submit">Change Password</button>
      </form>
        </>
    )
}
export default ChangePassword;