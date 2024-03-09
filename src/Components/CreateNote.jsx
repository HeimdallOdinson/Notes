import { useState, useEffect } from "react"
import { useNavigate} from "react-router-dom";
import { checkToken } from "../Methods";

function CreateNote(){
    const[title, setTitle]=useState('');
    const[body, setBody]=useState('');
    const[isVoiceNote, setIsVoiceNote]=useState(false);
    const[isPublic, setIsPublic]=useState(false);
    let goTo = useNavigate();
    //Uso del useEffect para comprobar si existe el token, es decir, que el usuario se ha autenticado
    //correctamente. Si no hay token redirige a la página de login.
    
    useEffect(() => {
      if(!checkToken()){
        window.alert("You must login before creating a Note")
          goTo("/login");
      }

  }, [goTo,])


    const sendNoteForm= async(event)=>{
        event.preventDefault();
        const noteData = {title:title,body:body,isVoiceNote:isVoiceNote, isPublic:isPublic}
        console.log(noteData);
        window.alert(String(await createNote(noteData)))
        goTo("/newNote")
    }

    async function createNote(noteData){
      return await fetch("http://localhost:8080/notes",{
          method:"POST",
          headers:{
              "Content-Type":'application/json',
              "Authorization" : "Bearer "+localStorage.getItem("token")
          },
          body:JSON.stringify(noteData)
      })
      .then((response)=>{
          if(response.status===401)return "Unauthorized";
          return response.json();
      })
      .then((data)=>{

          return data.id;

          
      })
      .catch(()=>{
          return "Error";
      })
  }
    return (
    <>
        <h1>Create a Note</h1>
        
      <form onSubmit={sendNoteForm}>
        <label htmlFor="Title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(event)=> setTitle(event.target.value)}
        />

        <label htmlFor="body">Note:</label>
        <input
          type="text"
          id="body"
          value={body}
          onChange={(event)=> setBody(event.target.value)}
        />
        <label htmlFor="Voice Note">Voice Note:</label>
        <input type="checkbox" 
            name="isVoiceNote" 
            id="isVoiceNote" 
            value={isVoiceNote}
            onChange={(event)=> setIsVoiceNote(event.target.checked)} 
        />
        <label htmlFor="Public">Public:</label>
        <input type="checkbox" 
            name="isPublic" 
            id="isPublic" 
            value={isPublic}
            onChange={(event)=> setIsPublic(event.target.checked)} 
        />
        <button type="submit">Store Note</button>
      </form>
    </>
    )
}
export default CreateNote;