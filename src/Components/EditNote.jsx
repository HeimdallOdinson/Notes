import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { checkToken} from "../Methods"
function EditNote(){
    const [note, setNote] = useState(null);
    const[title, setTitle]=useState('');
    const[body, setBody]=useState('');
    const[isVoiceNote, setIsVoiceNote]=useState(false);
    const[isPublic, setIsPublic]=useState(false);
    let goTo = useNavigate();
    const { noteId } = useParams();

    useEffect(() => {
      if(!checkToken()){
          window.alert("You must login before trying to modify a Note")
          goTo("/login");
      }

  }, [goTo])


      useEffect(() => {
        const fetchNote = async () => {
          try {
            const response = await fetch(`http://localhost:8080/notes/${noteId}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + localStorage.getItem("token")
              },
            });
    
            if (response.status === 401) {
              console.error('Unauthorized');
              return;
            }
    
            if (response.status === 404) {
              console.error('Note not found');
              
              return;
            }
    
            const data = await response.json();
            setNote(data);
            
            setTitle(data.title || '');
            setBody(data.body || '');
            setIsVoiceNote(data.isVoiceNote || false);
            setIsPublic(data.isPublic || false);
          } catch (error) {
            console.error('Error fetching note:', error);
          }
        };
    
        fetchNote();
      }, [noteId]);

    
      const sendNoteForm= async(event)=>{
        event.preventDefault();
        const noteData = {title:title,body:body,isVoiceNote:isVoiceNote, isPublic:isPublic}
        console.log(noteData);
        window.alert(String(await createNote(noteData)))
        goTo("/notes")
    }

    async function createNote(noteData){
        return await fetch(`http://localhost:8080/notes/${noteId}`,{
            method:"PUT",
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
            <h1>Edit the note</h1>
            
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
                onChange={(event)=> setIsVoiceNote(event.target.value)} 
            />
            <label htmlFor="Public">Public:</label>
            <input type="checkbox" 
                name="isPublic" 
                id="isPublic" 
                value={isPublic}
                onChange={(event)=> setIsPublic(event.target.value)} 
            />
            <button type="submit">Store Note</button>
          </form>
        </>
        )
    
}
export default EditNote;