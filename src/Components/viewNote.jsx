import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { formattedDate, checkToken } from "../Methods";

function ViewNote() {
    const [note, setNote] = useState(null);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [isVoiceNote, setIsVoiceNote] = useState(false);
    const [isPublic, setIsPublic] = useState(false);
    let goTo = useNavigate();
    const { noteId } = useParams();

    useEffect(() => {
        if(!checkToken()){
            window.alert("You must login before viewing a Note")
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
                if(response.status===200){
                const data = await response.json();
                console.log(data)
                setNote(data);
                setTitle(data.title || '');
                setBody(data.body || '');
                setIsVoiceNote(data.isVoiceNote || false);
                setIsPublic(data.isPublic || false);
                }else if(response.status === 401){
                    return 'Unauthorized';
                }else{
                    console.error('Note not found');
                    
                    return;
                }
                
            } catch (error) {
                console.error('Error fetching note:', error);
            }
        };

        fetchNote();
    }, [noteId]);



    const editNote = (noteId) => {
        goTo(`/modifynote/${noteId}`);
    };

    const DeleteNote =
        async function deleteNote(noteId) {
            return await fetch(`http://localhost:8080/notes/${noteId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                body: JSON.stringify(noteId)
            })
                .then((response) => {
                    if (response.status === 401) return "Unauthorized";
                    if (response.status === 404) return "Note not found";
                    if (response.status === 204) {
                        goTo("/notes");
                        return "Note deleted successfully";
                    }
                })
                .catch(() => {
                    return "Error";
                })
        }

    return (
        <>
        <h1>Note</h1>

        <div>
            <h2>Title: {title}</h2>
            <p>Note Content: {body}</p>
            <p>Created At: {formattedDate(note?.createdAt)}</p>
            <p>Modified At: {formattedDate(note?.modifiedAt)}</p>
            <p>Is Voice Note: {isVoiceNote ? "Yes" : "No"}</p>
            <p>Is Public: {isPublic ? "Yes" : "No"}</p>
        </div>

        <button onClick={() => DeleteNote(noteId)}>Eliminar</button>
        <button onClick={() => editNote(noteId)}>Modificar</button>
    </>
    )

}
export default ViewNote;