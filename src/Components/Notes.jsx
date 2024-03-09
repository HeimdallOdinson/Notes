import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { formattedDate, checkToken } from "../Methods";
function Notes() {
    const [notes, setNotes] = useState([]);
    const [filterType, setFilterType] = useState("all");
    const [orderBy, setOrderBy] = useState("creation");
    const [searchTerm, setSearchTerm] = useState("");
    let goTo = useNavigate();
    const { noteId } = useParams();

    useEffect(() => {
        if(!checkToken()){
            window.alert("You must login to see your notes")
            goTo("/login");
        }

    }, [goTo])

    useEffect(() => {
        fetchNoteList();
    }, []);

    const fetchNoteList = async () => {
        try {
            const response = await fetch("http://localhost:8080/notes", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            });

            if (response.status === 401) {
                throw new Error("Unauthorized");
            }

            const data = await response.json();
            setNotes(data);
        } catch (error) {
            console.error("Error fetching notes:", error);
        }
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
                        fetchNoteList();
                        return "Note deleted successfully";
                    }
                })
                .catch(() => {
                    return "Error";
                })
        }
    const viewNote = (noteId) =>{
       
        goTo(`/note/${noteId}`);
    }
    const editNote = (noteId) => {
        goTo(`/modifynote/${noteId}`);
    };
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
      };
    const handleOrderChange = (event) => {
        setOrderBy(event.target.value);
    };
    const handleFilterChange = (event) => {
        setFilterType(event.target.value);
    };
    const searchFilter = (note) => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return (
            note.title.toLowerCase().includes(lowerCaseSearchTerm) ||
            note.body.toLowerCase().includes(lowerCaseSearchTerm)
        );
    };
    const filteredNotes = notes
        .filter((note) => {
            if (filterType === "all") {
                return true; // Muestra todas las notas
            } else {
                return note.isVoiceNote === (filterType === "voice");
            }
        })
        .filter(searchFilter)
        .sort((a, b) => {
            switch (orderBy) {
                case "creation":
                    // Ordenar por fecha de creación (más reciente primero)
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case "modification":
                    // Ordenar por fecha de modificación (más reciente primero)
                    return new Date(b.modifiedAt) - new Date(a.modifiedAt);
                case "title":
                    // Ordenar alfabéticamente por título
                    return a.title.localeCompare(b.title);
                default:
                    return 0; // No debería ocurrir
            }
        });
        
    
    return (
        <div>
            <h1>Notes</h1>
            <label htmlFor="search">Search:</label>
            <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <label htmlFor="OrderBYy">Order by:</label>
            <select id="orderBy" value={orderBy} onChange={handleOrderChange}>
                <option value="creation">Creation Date</option>
                <option value="modification">Modification Date</option>
                <option value="title">Title</option>
            </select>
            <label htmlFor="filter">Filter by Type:</label>
            <select id="filter" value={filterType} onChange={handleFilterChange}>
                <option value="all">All</option>
                <option value="text">Text</option>
                <option value="voice">Voice</option>
            </select>
            <ul>
                {filteredNotes.map((note) => (
                    <li key={note.id}>
                        <h2>Title</h2>
                        <h2>{note.title}</h2>
                        <p>Note Content:</p>
                        <p>{note.body}</p>
                        <p>Created At: {formattedDate(note.createdAt)}</p>
                        <p>Modified At: {formattedDate(note.modifiedAt)}</p>
                        <p>Is Voice Note: {note.isVoiceNote ? "Yes" : "No"}</p>
                        <p>Is Public: {note.isPublic ? "Yes" : "No"}</p>
                        <button onClick={()=>viewNote(note.id)}>Visualizar</button>
                        <button onClick={() => DeleteNote(note.id)}>Eliminar</button>
                        <button onClick={() => editNote(note.id)}>Modificar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}



export default Notes;